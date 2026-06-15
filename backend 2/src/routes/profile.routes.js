import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/profile.controller.js';
import {
  addSkillToProfile,
  updateSkillProficiency,
  removeSkillFromProfile,
} from '../controllers/skill.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, updateProfileSchema, addExperienceSchema, addEducationSchema, addSkillSchema, updateSkillSchema } from '../utils/validation.js';

const router = express.Router();

// All routes require authentication and candidate role
router.use(authenticate);
router.use(authorize('CANDIDATE'));

router.get('/me', getMyProfile);
router.put('/me', validate(updateProfileSchema), updateMyProfile);
router.post('/experience', validate(addExperienceSchema), addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education management
router.post('/education', validate(addEducationSchema), addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Skill management
router.post('/skills', validate(addSkillSchema), addSkillToProfile);
router.put('/skills/:id', validate(updateSkillSchema), updateSkillProficiency);
router.delete('/skills/:id', removeSkillFromProfile);

export default router;

