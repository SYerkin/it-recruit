import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get my certificates
export const getMyCertificates = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can view certificates'));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const certificates = await prisma.certificate.findMany({
      where: { candidateProfileId: user.profile.id },
      orderBy: { issueDate: 'desc' },
    });

    return res.json(successResponse(certificates));
  } catch (error) {
    console.error('Get certificates error:', error);
    return res.status(500).json(errorResponse('Failed to fetch certificates'));
  }
};

// Create certificate
export const createCertificate = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can create certificates'));
    }

    const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const certificate = await prisma.certificate.create({
      data: {
        candidateProfileId: user.profile.id,
        name,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId,
        credentialUrl,
      },
    });

    return res.status(201).json(successResponse(certificate, 'Certificate created successfully'));
  } catch (error) {
    console.error('Create certificate error:', error);
    return res.status(500).json(errorResponse('Failed to create certificate'));
  }
};

// Update certificate
export const updateCertificate = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can update certificates'));
    }

    const { id } = req.params;
    const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    // Check ownership
    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!certificate || certificate.candidateProfileId !== user.profile.id) {
      return res.status(404).json(errorResponse('Certificate not found'));
    }

    const updated = await prisma.certificate.update({
      where: { id: parseInt(id) },
      data: {
        name,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId,
        credentialUrl,
      },
    });

    return res.json(successResponse(updated, 'Certificate updated successfully'));
  } catch (error) {
    console.error('Update certificate error:', error);
    return res.status(500).json(errorResponse('Failed to update certificate'));
  }
};

// Delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can delete certificates'));
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    // Check ownership
    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!certificate || certificate.candidateProfileId !== user.profile.id) {
      return res.status(404).json(errorResponse('Certificate not found'));
    }

    await prisma.certificate.delete({
      where: { id: parseInt(id) },
    });

    return res.json(successResponse(null, 'Certificate deleted successfully'));
  } catch (error) {
    console.error('Delete certificate error:', error);
    return res.status(500).json(errorResponse('Failed to delete certificate'));
  }
};

