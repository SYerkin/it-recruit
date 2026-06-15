import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidate.controller.js';

const router = express.Router();

router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export const candidateRoutes = router;

