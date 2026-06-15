import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Публичные routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Защищенные routes
router.get('/me', authenticate, getCurrentUser);

export const authRoutes = router;

