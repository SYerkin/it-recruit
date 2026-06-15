import express from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Все routes требуют аутентификации
router.get('/', authenticate, getApplications);
router.get('/:id', authenticate, getApplicationById);
router.post('/', authenticate, createApplication);
router.put('/:id', authenticate, updateApplication);
router.delete('/:id', authenticate, deleteApplication);

export const applicationRoutes = router;

