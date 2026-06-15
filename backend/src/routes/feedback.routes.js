import express from 'express';
import { createFeedback, createMentorApplication } from '../controllers/feedback.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Optional auth — can be used by guests too
router.post('/', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    authenticate(req, res, (err) => {
      if (err) next();
      else next();
    });
  } else {
    next();
  }
}, createFeedback);

router.post('/mentor-applications', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    authenticate(req, res, (err) => {
      if (err) next();
      else next();
    });
  } else {
    next();
  }
}, createMentorApplication);

export default router;
