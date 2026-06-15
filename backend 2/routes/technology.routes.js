import express from 'express';
import {
  getTechnologies,
  getTechnologyById,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from '../controllers/technology.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Публичные routes
router.get('/', getTechnologies);
router.get('/:id', getTechnologyById);

// Защищенные routes (только для Admin)
router.post('/', authenticate, authorize('admin'), createTechnology);
router.put('/:id', authenticate, authorize('admin'), updateTechnology);
router.delete('/:id', authenticate, authorize('admin'), deleteTechnology);

export const technologyRoutes = router;

