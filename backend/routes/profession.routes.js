import express from 'express';
import {
  getProfessions,
  getProfessionById,
  createProfession,
  updateProfession,
  deleteProfession,
} from '../controllers/profession.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Публичные routes
router.get('/', getProfessions);
router.get('/:id', getProfessionById);

// Защищенные routes (только для Admin)
router.post('/', authenticate, authorize('admin'), createProfession);
router.put('/:id', authenticate, authorize('admin'), updateProfession);
router.delete('/:id', authenticate, authorize('admin'), deleteProfession);

export const professionRoutes = router;

