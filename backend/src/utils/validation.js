import { z } from 'zod';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'HR', 'CANDIDATE']).default('CANDIDATE'),
  telegramUsername: z.string().max(32).regex(/^[a-zA-Z0-9_]+$/, 'Только латиница, цифры и подчёркивание').optional().nullable().transform((v) => v === '' ? null : v),
});

export const updateMeSchema = z.object({
  telegramUsername: z.string().max(32).regex(/^[a-zA-Z0-9_]+$/, 'Только латиница, цифры и подчёркивание').optional().nullable().transform((v) => v === '' ? null : v),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(6, 'Пароль не менее 6 символов'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Некорректный email'),
  newPassword: z.string().min(6, 'Пароль не менее 6 символов'),
});

// Profile validation schemas
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  cvFileUrl: z.string().url().optional().or(z.literal('')),
  isOpenToWork: z.boolean().optional(),
  isPublicProfile: z.boolean().optional(),
});

export const addExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  endDate: z.string().optional().or(z.date().optional()).nullable().transform((val) => {
    if (!val) return null;
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  description: z.string().optional(),
});

export const addEducationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional().or(z.date().optional()).nullable().transform((val) => {
    if (!val) return null;
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  endDate: z.string().optional().or(z.date().optional()).nullable().transform((val) => {
    if (!val) return null;
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  description: z.string().optional(),
});

// Job validation schemas
export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
  benefits: z.string().optional(),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  currency: z.string().default('USD'),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED']).default('DRAFT'),
  requiredSkillIds: z.array(z.number().int().positive()).min(1, 'At least one skill is required'),
  companyId: z.number().int().positive().optional(),
  workSchedule: z.enum(['FULL_TIME', 'PART_TIME']).optional().nullable(),
  workMode: z.enum(['OFFICE', 'REMOTE', 'HYBRID']).optional().nullable(),
  workType: z.enum(['PERMANENT', 'PROJECT']).optional().nullable(),
  experienceLevel: z.enum(['INTERN', 'JUNIOR', 'MIDDLE', 'SENIOR']).optional().nullable(),
});

// Application validation schemas
export const applyJobSchema = z.object({
  coverLetter: z.string().optional(),
});

const APPLICATION_STATUSES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED'];

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
});

const FEEDBACK_CRITERIA_KEYS = ['communication', 'speed', 'transparency', 'professionalism'];

export const applicationFeedbackSchema = z.object({
  rating: z.number().int().min(1, 'Оценка от 1 до 10').max(10, 'Оценка от 1 до 10'),
  criteriaRatings: z.record(
    z.string(),
    z.number().int().min(1).max(10)
  ).optional().nullable().refine(
    (obj) => !obj || Object.keys(obj).every((k) => FEEDBACK_CRITERIA_KEYS.includes(k)),
    { message: 'Допустимые критерии: communication, speed, transparency, professionalism' }
  ),
  comment: z.string().max(2000).optional().nullable(),
});

// Invitation validation schemas
export const createInvitationSchema = z.object({
  jobId: z.number().int().positive(),
  candidateProfileId: z.number().int().positive(),
  message: z.string().optional(),
  expiresAt: z.string().datetime().optional().or(z.date().optional()).nullable(),
});

// Skill validation schemas
export const createSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'MOBILE', 'OTHER']).optional().default('OTHER'),
});

export const addSkillSchema = z.object({
  skillId: z.number().int().positive(),
  proficiencyLevel: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED']).optional().default('BASIC'),
  yearsOfExperience: z.number().int().min(0).optional(),
});

export const updateSkillSchema = z.object({
  proficiencyLevel: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED']).optional(),
  yearsOfExperience: z.number().int().min(0).optional().nullable(),
});

// Company validation schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  address2gis: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  socialLinks: z.record(z.string(), z.string()).optional().nullable(),
  foundedYear: z.number().int().optional().nullable(),
  employeeCount: z.string().optional(),
  documents: z.array(z.string().url()).optional(),
  officePhotos: z.array(z.string().url()).optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  address2gis: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  socialLinks: z.record(z.string(), z.string()).optional().nullable(),
  foundedYear: z.number().int().optional().nullable(),
  employeeCount: z.string().optional().nullable(),
  documents: z.array(z.string().url()).optional().nullable(),
  officePhotos: z.array(z.string().url()).optional().nullable(),
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};
