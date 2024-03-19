import { execSync } from 'child_process';
import request from 'supertest';
import { app, server } from '../server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'API_Web_Token';

const executeCommand = (command: string) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    process.exit(1);
  }
};

describe('UserController', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    await prisma.user.deleteMany();

    const newUser = await prisma.user.create({
      data: { name: 'Test User', email: 'test@example.com' },
    });

    const accessToken = jwt.sign({ user_id: newUser.id }, JWT_SECRET);
    await prisma.personalAccessToken.create({
      data: {
        token: accessToken,
        user: { connect: { id: newUser.id } },
      },
    });

    token = accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
    executeCommand('npx prisma migrate reset -f');
  });

  describe('GET /api/users', () => {
    it('should return an array of users with a valid token', async () => {
      await prisma.user.createMany({
        data: [
          { name: 'User 1', email: 'user1@example.com' },
          { name: 'User 2', email: 'user2@example.com' },
        ],
      });

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return an unauthorized status if no token is provided', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid input data', async () => {
      const userData = { name: 'New Test User', email: 'newtest@example.com' };
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user).toMatchObject(userData);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user by ID with a valid token', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should return a 404 error if the user ID is not found', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return an unauthorized status if no token is provided', async () => {
      const response = await request(app)
        .get('/api/users/1');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {

    beforeEach(async () => {
      const newUser = await prisma.user.create({
        data: { name: 'Test User', email: `test${Math.random()}@example.com` },
      });
      userId = newUser.id;
    });

    afterEach(async () => {
      if (userId) {
        await prisma.user.delete({
          where: { id: userId },
        });
      }
    });

    it('should return a 401 status if no token is provided', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`);

      expect(response.status).toBe(401);
    });
  });
});
