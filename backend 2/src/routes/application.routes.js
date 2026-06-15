import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getMyJobApplications,
  getApplicationById,
  updateApplicationStatus,
  submitApplicationFeedback,
  getApplicationFeedbacks,
} from '../controllers/application.controller.js';
import { getChat, sendMessage, markChatRead } from '../controllers/chat.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  validate,
  applyJobSchema,
  updateApplicationStatusSchema,
  applicationFeedbackSchema,
} from '../utils/validation.js';

const router = express.Router();

// Candidate routes
router.post('/jobs/:id/apply', authenticate, authorize('CANDIDATE'), validate(applyJobSchema), applyForJob);
router.get('/me', authenticate, authorize('CANDIDATE'), getMyApplications);

// HR/Admin routes
router.get('/my', authenticate, authorize('HR', 'ADMIN'), getMyJobApplications);
router.get('/jobs/:id', authenticate, authorize('HR', 'ADMIN'), getJobApplications);

// Чат по заявке (кандидат и HR) — более специфичные маршруты до /:id
router.get('/:id/chat', authenticate, getChat);
router.post('/:id/chat/messages', authenticate, sendMessage);
router.post('/:id/chat/read', authenticate, markChatRead);

// Отзывы
router.post('/:id/feedback', authenticate, validate(applicationFeedbackSchema), submitApplicationFeedback);
router.get('/:id/feedback', authenticate, getApplicationFeedbacks);

router.get('/:id', authenticate, getApplicationById);
router.put('/:id/status', authenticate, authorize('HR', 'ADMIN'), validate(updateApplicationStatusSchema), updateApplicationStatus);

export default router;

