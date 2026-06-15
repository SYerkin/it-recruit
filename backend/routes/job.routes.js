import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Публичные routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Защищенные routes (только для HR и Admin)
router.post('/', authenticate, authorize('hr', 'admin'), createJob);
router.put('/:id', authenticate, authorize('hr', 'admin'), updateJob);
router.delete('/:id', authenticate, authorize('hr', 'admin'), deleteJob);

export const jobRoutes = router;

