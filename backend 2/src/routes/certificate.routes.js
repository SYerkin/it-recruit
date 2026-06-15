import express from 'express';
import {
  getMyCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificate.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('CANDIDATE'));

router.get('/', getMyCertificates);
router.post('/', createCertificate);
router.put('/:id', updateCertificate);
router.delete('/:id', deleteCertificate);

export default router;

