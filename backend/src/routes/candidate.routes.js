import express from 'express';
import {
  getCandidates,
  getCandidateById,
  getCandidatePublic,
  getCandidateReviews,
  getMyProfileViewers,
} from '../controllers/candidate.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route (no auth required)
router.get('/:id/public', getCandidatePublic);

// Candidate personal stats routes
router.get('/me/profile-viewers', authenticate, authorize('CANDIDATE'), getMyProfileViewers);

// Protected routes (HR/Admin only)
router.use(authenticate);
router.use(authorize('HR', 'ADMIN'));

router.get('/', getCandidates);
router.get('/:id/reviews', getCandidateReviews);
router.get('/:id', getCandidateById);

export default router;

