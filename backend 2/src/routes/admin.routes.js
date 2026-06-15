import express from 'express';
import {
  getAdminStats,
  getAdminCompanies,
  getAdminApplications,
  getAdminUsers,
  resetUserPassword,
  getAdminFeedback,
  markFeedbackRead,
  getMentorApplications,
  updateMentorApplication,
  getVerificationRequests,
  updateVerificationRequest,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/companies', getAdminCompanies);
router.get('/applications', getAdminApplications);
router.get('/users', getAdminUsers);
router.post('/users/:id/reset-password', resetUserPassword);
router.get('/feedback', getAdminFeedback);
router.patch('/feedback/:id/read', markFeedbackRead);
router.get('/mentor-applications', getMentorApplications);
router.patch('/mentor-applications/:id', updateMentorApplication);
router.get('/verification-requests', getVerificationRequests);
router.patch('/verification-requests/:id', updateVerificationRequest);

export default router;
