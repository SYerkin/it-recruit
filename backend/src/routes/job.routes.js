import express from 'express';
import { getJobs, getJobById, createJob, updateJob, getRecommendedCandidates } from '../controllers/job.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, createJobSchema } from '../utils/validation.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id/recommended-candidates', authenticate, authorize('HR', 'ADMIN'), getRecommendedCandidates);
router.get('/:id', getJobById);

// Protected routes (HR/Admin only)
router.post('/', authenticate, authorize('HR', 'ADMIN'), validate(createJobSchema), createJob);
router.put('/:id', authenticate, authorize('HR', 'ADMIN'), updateJob);

export default router;

