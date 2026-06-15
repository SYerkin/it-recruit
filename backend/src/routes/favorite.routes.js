import express from 'express';
import {
  getMyFavoriteJobs,
  addFavoriteJob,
  removeFavoriteJob,
  checkFavoriteJob,
} from '../controllers/favorite.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('CANDIDATE'));

router.get('/', getMyFavoriteJobs);
router.post('/', addFavoriteJob);
router.delete('/:jobId', removeFavoriteJob);
router.get('/check/:jobId', checkFavoriteJob);

export default router;

