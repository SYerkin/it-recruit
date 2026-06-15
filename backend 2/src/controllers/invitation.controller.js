import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Create invitation (HR/Admin only)
export const createInvitation = async (req, res) => {
  try {
    if (req.user.role !== 'HR' && req.user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Only HR and Admin can create invitations'));
    }

    const { jobId, candidateProfileId, message, expiresAt } = req.body;

    // Check if job exists and user has permission
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    if (job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Permission denied. You can only invite to your own jobs'));
    }

    // Check if candidate profile exists
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { id: parseInt(candidateProfileId) },
    });

    if (!candidateProfile) {
      return res.status(404).json(errorResponse('Candidate profile not found'));
    }

    // Check if already invited
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        jobId: parseInt(jobId),
        candidateProfileId: parseInt(candidateProfileId),
      },
    });

    if (existingInvitation) {
      return res.status(400).json(errorResponse('Invitation already exists for this candidate and job'));
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: parseInt(jobId),
        candidateProfileId: parseInt(candidateProfileId),
      },
    });

    if (existingApplication) {
      return res.status(400).json(errorResponse('Candidate has already applied for this job'));
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        jobId: parseInt(jobId),
        candidateProfileId: parseInt(candidateProfileId),
        message: message || null,
        invitedById: req.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
          },
        },
        candidateProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            headline: true,
          },
        },
        invitedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json(successResponse(invitation, 'Invitation sent successfully'));
  } catch (error) {
    console.error('Create invitation error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('Invitation already exists'));
    }
    return res.status(500).json(errorResponse('Failed to create invitation'));
  }
};

// Get my invitations (Candidate only)
export const getMyInvitations = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can view their invitations'));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        candidateProfileId: user.profile.id,
      },
      include: {
        job: {
          include: {
            requiredSkills: {
              include: {
                skill: true,
              },
            },
            creator: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        invitedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(successResponse(invitations));
  } catch (error) {
    console.error('Get my invitations error:', error);
    return res.status(500).json(errorResponse('Failed to fetch invitations'));
  }
};

// Accept invitation (Candidate only)
export const acceptInvitation = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can accept invitations'));
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: true,
      },
    });

    if (!invitation) {
      return res.status(404).json(errorResponse('Invitation not found'));
    }

    if (invitation.candidateProfileId !== user.profile.id) {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    if (invitation.status !== 'PENDING') {
      return res.status(400).json(errorResponse(`Invitation is already ${invitation.status.toLowerCase()}`));
    }

    // Check if expired
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      await prisma.invitation.update({
        where: { id: parseInt(id) },
        data: { status: 'EXPIRED' },
      });
      return res.status(400).json(errorResponse('Invitation has expired'));
    }

    // Update invitation status
    const updatedInvitation = await prisma.invitation.update({
      where: { id: parseInt(id) },
      data: { status: 'ACCEPTED' },
    });

    // Create application automatically
    console.log(`[acceptInvitation] Creating application for jobId: ${invitation.jobId}, candidateProfileId: ${user.profile.id}`);
    const application = await prisma.$transaction(async (tx) => {
      const created = await tx.application.create({
        data: {
          jobId: invitation.jobId,
          candidateProfileId: user.profile.id,
          status: 'APPLIED',
          coverLetter: `Accepted invitation from HR`,
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: created.id,
          fromStatus: null,
          toStatus: 'APPLIED',
          changedById: req.user.id,
          changedByRole: req.user.role,
          note: 'Application created by accepted invitation',
        },
      });

      return created;
    });

    return res.json(successResponse({
      invitation: updatedInvitation,
      application,
    }, 'Invitation accepted and application created'));
  } catch (error) {
    console.error('Accept invitation error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('Application already exists for this job'));
    }
    return res.status(500).json(errorResponse('Failed to accept invitation'));
  }
};

// Decline invitation (Candidate only)
export const declineInvitation = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can decline invitations'));
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!invitation) {
      return res.status(404).json(errorResponse('Invitation not found'));
    }

    if (invitation.candidateProfileId !== user.profile.id) {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    if (invitation.status !== 'PENDING') {
      return res.status(400).json(errorResponse(`Invitation is already ${invitation.status.toLowerCase()}`));
    }

    const updated = await prisma.invitation.update({
      where: { id: parseInt(id) },
      data: { status: 'DECLINED' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.json(successResponse(updated, 'Invitation declined'));
  } catch (error) {
    console.error('Decline invitation error:', error);
    return res.status(500).json(errorResponse('Failed to decline invitation'));
  }
};

// Get invitations for job (HR/Admin only)
export const getJobInvitations = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    if (job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        jobId: parseInt(id),
      },
      include: {
        candidateProfile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        invitedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(successResponse(invitations));
  } catch (error) {
    console.error('Get job invitations error:', error);
    return res.status(500).json(errorResponse('Failed to fetch invitations'));
  }
};

