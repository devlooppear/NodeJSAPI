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

executeCommand('npx prisma migrate dev');

describe('UserController', () => {
  let token: string;

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
    it('should return an array of users', async () => {
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
  });
  

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
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
    it('should get a user by ID', async () => {
      const response = await request(app)
        .get('/api/users/1') 
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should return 404 if user ID is not found', async () => {
      const response = await request(app)
        .get('/api/users/999') 
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });
});
