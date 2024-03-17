// controllers/userController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export default class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: { name, email },
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      let errorMessage = 'Internal server error';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateUser(req: Request, res: Response) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
