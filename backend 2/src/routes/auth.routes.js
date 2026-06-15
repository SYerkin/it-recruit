import express from 'express';
import { register, login, getMe, updateMe, changePassword, forgotPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate, registerSchema, loginSchema, updateMeSchema, changePasswordSchema, forgotPasswordSchema } from '../utils/validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate(updateMeSchema), updateMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;

