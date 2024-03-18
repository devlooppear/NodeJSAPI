import request from 'supertest';
import { app } from '../server';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

// Mock user data
const mockUser: User = {
  id: 1,
  name: 'User1',
  email: 'user1@example.com',
  created_at: new Date(),
  updated_at: new Date(),
};

// Mock JWT_SECRET
const JWT_SECRET = 'API_Web_Token';

// Helper function to generate mock access token
function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET);
}

// Mock PrismaClient using jest.mock
jest.mock('@prisma/client', () => {
  const mockUser: User = {
    id: 1,
    name: 'User1',
    email: 'user1@example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      user: {
        findMany: jest.fn().mockResolvedValueOnce([mockUser]),
        findUnique: jest.fn().mockResolvedValueOnce(mockUser),
        create: jest.fn().mockResolvedValueOnce(mockUser),
        update: jest.fn().mockResolvedValueOnce(mockUser),
        delete: jest.fn().mockResolvedValueOnce(undefined),
      },
    })),
  };
});

describe('UserController', () => {
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${generateAccessToken({ userId: 1 })}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockUser]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID if found', async () => {
      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${generateAccessToken({ userId: 1 })}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      // Mocking user not found scenario
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (PrismaClient as any).user.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${generateAccessToken({ userId: 1 })}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'NewUser', email: 'newuser@example.com' })
        .set('Authorization', `Bearer ${generateAccessToken({ userId: 1 })}`);

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(mockUser);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user by ID', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .send({ name: 'UpdatedUser', email: 'updateduser@example.com' })
        .set('Authorization', `Bearer ${generateAccessToken({ userId: 1 })}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user by ID', async () => {
      const res = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${generateAccessToken({ userId: 1 })}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'User deleted successfully' });
    });
  });
});
