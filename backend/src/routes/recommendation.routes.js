import express from 'express';
import {
  getRecommendations,
  getRecommendationCategoryItems,
  createRecommendationCategory,
  updateRecommendationCategory,
  createRecommendationItem,
  updateRecommendationItem,
  deleteRecommendationItem,
} from '../controllers/recommendation.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getRecommendations);
router.get('/:categoryId', getRecommendationCategoryItems);

router.post('/categories', authenticate, authorize('ADMIN'), createRecommendationCategory);
router.put('/categories/:id', authenticate, authorize('ADMIN'), updateRecommendationCategory);
router.post('/items', authenticate, authorize('ADMIN'), createRecommendationItem);
router.put('/items/:id', authenticate, authorize('ADMIN'), updateRecommendationItem);
router.delete('/items/:id', authenticate, authorize('ADMIN'), deleteRecommendationItem);

export default router;
