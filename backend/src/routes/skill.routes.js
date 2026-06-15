import express from 'express';
import { getAllSkills, createSkill } from '../controllers/skill.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, createSkillSchema } from '../utils/validation.js';

const router = express.Router();

// Public route - get all skills
router.get('/', getAllSkills);

// Protected route - create skill (HR/Admin only)
router.post('/', authenticate, authorize('HR', 'ADMIN'), validate(createSkillSchema), createSkill);

export default router;

