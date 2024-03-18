import express, { Response } from 'express';
import UserController from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateToken'; // Import the authentication middleware

const router = express.Router();
const userController = new UserController();

// Default route
router.get('/', (res: Response) => {
  res.json({ message: 'Welcome to the Node.js API!' });
});

// Route for creating a new user (no authentication required)
router.post('/users', userController.createUser);

// Apply authentication middleware to routes requiring token validation
router.use(authenticateToken);

// Routes for User entity (authentication required)
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
