import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      hrCount,
      candidateCount,
      totalCompanies,
      verifiedCompanies,
      activeJobs,
      totalApplications,
      applicationsByStatus,
      totalMentors,
      pendingVerificationRequests,
      unreadFeedback,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'HR' } }),
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
      prisma.company.count(),
      prisma.company.count({ where: { isVerified: true } }),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count(),
      prisma.application.groupBy({ by: ['status'], _count: true }),
      prisma.mentor.count({ where: { isActive: true } }),
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      prisma.feedbackMessage.count({ where: { isRead: false } }),
    ]);

    const statusMap = {};
    applicationsByStatus.forEach(({ status, _count }) => {
      statusMap[status] = _count;
    });

    return res.json(successResponse({
      users: { total: totalUsers, hr: hrCount, candidates: candidateCount },
      companies: totalCompanies,
      verifiedCompanies,
      activeJobs,
      applications: { total: totalApplications, byStatus: statusMap },
      mentors: totalMentors,
      pendingVerifications: pendingVerificationRequests,
      unreadFeedback,
    }));
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json(errorResponse('Failed to get stats'));
  }
};

// GET /api/admin/companies
export const getAdminCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        owner: { select: { id: true, email: true } },
        _count: { select: { jobs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(successResponse(companies));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to get companies'));
  }
};

// GET /api/admin/applications
export const getAdminApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: status ? { status } : undefined,
        include: {
          job: {
            select: { id: true, title: true, company: { select: { id: true, name: true } } },
          },
          candidateProfile: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.application.count({ where: status ? { status } : undefined }),
    ]);

    return res.json(successResponse({ applications, total, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to get applications'));
  }
};

// GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  try {
    const { role, search } = req.query;

    const users = await prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(search && {
          OR: [{ email: { contains: search } }],
        }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: { select: { firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(successResponse(users));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to get users'));
  }
};

// POST /api/admin/users/:id/reset-password
export const resetUserPassword = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json(errorResponse('Password must be at least 6 characters'));
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json(errorResponse('User not found'));

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { password: hashed } });

    return res.json(successResponse(null, 'Password updated'));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to reset password'));
  }
};

// GET /api/admin/feedback
export const getAdminFeedback = async (req, res) => {
  try {
    const { type, isRead } = req.query;

    const messages = await prisma.feedbackMessage.findMany({
      where: {
        ...(type && { type }),
        ...(isRead !== undefined && { isRead: isRead === 'true' }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(successResponse(messages));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to get feedback'));
  }
};

// PATCH /api/admin/feedback/:id/read
export const markFeedbackRead = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.feedbackMessage.update({ where: { id }, data: { isRead: true } });
    return res.json(successResponse(null, 'Marked as read'));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to update feedback'));
  }
};

// GET /api/admin/mentor-applications
export const getMentorApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const applications = await prisma.mentorApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return res.json(successResponse(applications));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to get mentor applications'));
  }
};

// PATCH /api/admin/mentor-applications/:id
export const updateMentorApplication = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, adminComment } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status'));
    }

    const application = await prisma.mentorApplication.update({
      where: { id },
      data: { status, ...(adminComment && { adminComment }) },
    });

    // При одобрении — автоматически создаём ментора
    if (status === 'APPROVED') {
      await prisma.mentor.create({
        data: {
          name: application.name,
          title: application.currentTitle,
          bio: application.bio,
          skills: JSON.stringify(application.skills.split(',').map((s) => s.trim())),
          experienceYears: application.experienceYears,
          pricePerSession: 0,
          ...(application.userId && { userId: application.userId }),
        },
      });
    }

    return res.json(successResponse(application, `Application ${status.toLowerCase()}`));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to update application'));
  }
};

export const getVerificationRequests = async (_req, res) => {
  try {
    const requests = await prisma.verificationRequest.findMany({
      include: {
        company: { select: { id: true, name: true } },
        submittedBy: { select: { id: true, email: true } },
        reviewedBy: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const normalized = requests.map((item) => ({
      ...item,
      documents: item.documents ? JSON.parse(item.documents) : [],
    }));

    return res.json(successResponse(normalized));
  } catch (error) {
    console.error('Get verification requests error:', error);
    return res.status(500).json(errorResponse('Failed to get verification requests'));
  }
};

export const updateVerificationRequest = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, adminComment } = req.body;
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid request ID'));
    }
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json(errorResponse('Status must be APPROVED or REJECTED'));
    }

    const updated = await prisma.verificationRequest.update({
      where: { id },
      data: {
        status,
        adminComment: adminComment ?? null,
        reviewedAt: new Date(),
        reviewedById: req.user.id,
      },
    });

    if (status === 'APPROVED') {
      await prisma.company.update({
        where: { id: updated.companyId },
        data: { isVerified: true },
      });
    } else {
      await prisma.company.update({
        where: { id: updated.companyId },
        data: { isVerified: false },
      });
    }

    return res.json(successResponse(updated, 'Verification request updated successfully'));
  } catch (error) {
    console.error('Update verification request error:', error);
    return res.status(500).json(errorResponse('Failed to update verification request'));
  }
};
