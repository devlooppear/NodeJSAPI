import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRequestValidator } from '../requests/userRequest';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'API_Web_Token';

export default class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error: ' + error});
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
      res.status(500).json({ error: 'Internal server error: ' + error});
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const validation = await UserRequestValidator.validateCreate(req);

      if (validation.fails()) {
        return res.status(400).json({ errors: validation.errors.all() });
      }

      const { name, email } = req.body;

      // Create a new user
      const newUser = await prisma.user.create({
        data: { name, email },
      });

      // Generate a JWT for the access token
      const accessToken = jwt.sign({ user_id: newUser.id }, JWT_SECRET);

      // Create a personal access token for the user
      await prisma.personalAccessToken.create({
        data: {
          token: accessToken,
          user: { connect: { id: newUser.id } },
        },
      });

      // Return the newly created user and access token
      res.status(201).json({ user: newUser });
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
    const validation = UserRequestValidator.validateUpdate(req);

    if (validation.fails()) {
      return res.status(400).json({ errors: validation.errors.all() });
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
      res.status(500).json({ error: 'Internal server error: ' + error});
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      // Delete associated personal access tokens first
      await prisma.personalAccessToken.deleteMany({
        where: { user_id: userId },
      });

      // Then delete the user
      await prisma.user.delete({
        where: { id: userId },
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error: ' + error });
    }
  }
}
