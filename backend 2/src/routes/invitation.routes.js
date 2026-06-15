import express from 'express';
import {
  createInvitation,
  getMyInvitations,
  acceptInvitation,
  declineInvitation,
  getJobInvitations,
} from '../controllers/invitation.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, createInvitationSchema } from '../utils/validation.js';

const router = express.Router();

// Candidate routes
router.get('/me', authenticate, authorize('CANDIDATE'), getMyInvitations);
router.put('/:id/accept', authenticate, authorize('CANDIDATE'), acceptInvitation);
router.put('/:id/decline', authenticate, authorize('CANDIDATE'), declineInvitation);

// HR/Admin routes
router.post('/', authenticate, authorize('HR', 'ADMIN'), validate(createInvitationSchema), createInvitation);
router.get('/jobs/:id', authenticate, authorize('HR', 'ADMIN'), getJobInvitations);

export default router;

