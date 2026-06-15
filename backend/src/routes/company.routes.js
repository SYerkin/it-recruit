import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompanyById,
  getAllCompanies,
  getFeaturedCompanies,
  uploadCompanyLogo,
  uploadCompanyDocument,
  createVerificationRequest,
  getCompanyVerificationStatus,
  getCompanyHrReviews,
} from '../controllers/company.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, createCompanySchema, updateCompanySchema } from '../utils/validation.js';

const router = express.Router();
const uploadsRoot = path.join(process.cwd(), 'uploads');
const logosDir = path.join(uploadsRoot, 'logos');
const docsDir = path.join(uploadsRoot, 'documents');
fs.mkdirSync(logosDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

const documentFileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isPdf = file.mimetype === 'application/pdf';
  if (!isImage && !isPdf) {
    return cb(new Error('Only image or PDF files are allowed'));
  }
  cb(null, true);
};

const createStorage = (targetDir) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, targetDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`);
    },
  });

const logoUpload = multer({
  storage: createStorage(logosDir),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const documentUpload = multer({
  storage: createStorage(docsDir),
  fileFilter: documentFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Public routes
router.get('/featured', getFeaturedCompanies);
router.get('/', getAllCompanies);
router.get('/:id/hr-reviews', getCompanyHrReviews);
router.get('/:id/verification-status', getCompanyVerificationStatus);
// Protected route for /me must come before /:id to avoid route conflict
router.get('/me', authenticate, authorize('HR', 'ADMIN'), getMyCompany);
router.get('/:id', getCompanyById);

// Protected routes (HR/Admin only)
router.post('/', authenticate, authorize('HR', 'ADMIN'), validate(createCompanySchema), createCompany);
router.put('/', authenticate, authorize('HR', 'ADMIN'), validate(updateCompanySchema), updateCompany);
router.post('/upload-logo', authenticate, authorize('HR', 'ADMIN'), logoUpload.single('file'), uploadCompanyLogo);
router.post('/upload-document', authenticate, authorize('HR', 'ADMIN'), documentUpload.single('file'), uploadCompanyDocument);
router.post('/verification-request', authenticate, authorize('HR', 'ADMIN'), createVerificationRequest);

export default router;

