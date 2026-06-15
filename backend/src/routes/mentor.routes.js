import express from 'express';
import {
  getMentors,
  getMentorById,
  createMentorRequest,
  payMentorSession,
  createMentorReview,
  getMentorReviews,
  createMentor,
  updateMentor,
  deleteMentor,
} from '../controllers/mentor.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public
router.get('/', getMentors);
router.get('/:id', getMentorById);
router.get('/:id/reviews', getMentorReviews);

// Authenticated users
router.post('/:id/request', authenticate, createMentorRequest);
router.post('/:id/pay', authenticate, payMentorSession);
router.post('/:id/reviews', authenticate, createMentorReview);

// Admin only
router.post('/', authenticate, authorize('ADMIN'), createMentor);
router.put('/:id', authenticate, authorize('ADMIN'), updateMentor);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteMentor);

export default router;
