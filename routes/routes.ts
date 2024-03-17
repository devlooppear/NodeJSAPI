// routes/routes.ts

import express, { Response } from 'express';
import UserController from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

// Default route
router.get('/', (res: Response) => {
  res.json({ message: 'Welcome to the Node.js API!' });
});

// Routes for User entity
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
