import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

const buildStatusHistoryWithFallback = (application) => {
  const existing = Array.isArray(application?.statusHistory) ? application.statusHistory : [];
  if (existing.length > 0) return existing;

  const createdAt = application?.createdAt || new Date().toISOString();
  const updatedAt = application?.updatedAt || createdAt;
  const syntheticBase = (application?.id || 0) * 10;

  const fallback = [
    {
      id: -(syntheticBase + 1),
      applicationId: application?.id,
      fromStatus: null,
      toStatus: 'APPLIED',
      changedById: null,
      changedByRole: 'SYSTEM',
      note: 'История восстановлена из текущих данных (старый отклик)',
      createdAt,
      changedBy: null,
    },
  ];

  if (application?.status && application.status !== 'APPLIED') {
    fallback.push({
      id: -(syntheticBase + 2),
      applicationId: application?.id,
      fromStatus: 'APPLIED',
      toStatus: application.status,
      changedById: null,
      changedByRole: 'SYSTEM',
      note: 'Точный путь статусов недоступен (история внедрена позже)',
      createdAt: updatedAt,
      changedBy: null,
    });
  }

  return fallback;
};

// Apply for job (Candidate only)
export const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can apply for jobs'));
    }

    const { id } = req.params;
    const { coverLetter } = req.body;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    if (job.status !== 'ACTIVE') {
      return res.status(400).json(errorResponse('Job is not active'));
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found. Please complete your profile first.'));
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: parseInt(id),
        candidateProfileId: user.profile.id,
      },
    });

    if (existingApplication) {
      return res.status(400).json(errorResponse('You have already applied for this job'));
    }

    // Create application + initial status history
    const application = await prisma.$transaction(async (tx) => {
      const created = await tx.application.create({
        data: {
          jobId: parseInt(id),
          candidateProfileId: user.profile.id,
          coverLetter,
          status: 'APPLIED',
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          candidateProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
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
          note: 'Application submitted by candidate',
        },
      });

      return created;
    });

    return res.status(201).json(successResponse(application, 'Application submitted successfully'));
  } catch (error) {
    console.error('Apply for job error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('You have already applied for this job'));
    }
    return res.status(500).json(errorResponse('Failed to submit application'));
  }
};

// Get my applications (Candidate only)
export const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can view their applications'));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      console.error(`[getMyApplications] Profile not found for user ${req.user.id}`);
      return res.status(404).json(errorResponse('Profile not found'));
    }

    console.log(`[getMyApplications] User ${req.user.id} (${req.user.email}), Profile ID: ${user.profile.id}`);

    // Also check all applications to debug
    const allApplications = await prisma.application.findMany({
      take: 5,
      include: {
        candidateProfile: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    console.log(`[getMyApplications] Sample of all applications in DB:`, allApplications.map(app => ({
      id: app.id,
      candidateProfileId: app.candidateProfileId,
      candidateUserId: app.candidateProfile?.userId,
      candidateName: `${app.candidateProfile?.firstName} ${app.candidateProfile?.lastName}`
    })));

    const applications = await prisma.application.findMany({
      where: {
        candidateProfileId: user.profile.id,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
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
        statusHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`[getMyApplications] Found ${applications.length} applications for user ${req.user.id} (profile ${user.profile.id})`);
    if (applications.length > 0) {
      console.log(`[getMyApplications] Sample application:`, {
        id: applications[0].id,
        jobId: applications[0].jobId,
        candidateProfileId: applications[0].candidateProfileId,
        status: applications[0].status,
        jobTitle: applications[0].job?.title
      });
    }

    const applicationsWithHistory = applications.map((application) => ({
      ...application,
      statusHistory: buildStatusHistoryWithFallback(application),
    }));

    return res.json(successResponse(applicationsWithHistory));
  } catch (error) {
    console.error('Get my applications error:', error);
    return res.status(500).json(errorResponse('Failed to fetch applications'));
  }
};

// Get applications for job (HR/Admin only)
export const getJobApplications = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists and user has permission
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    if (job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    const applications = await prisma.application.findMany({
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
            workExperiences: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(successResponse(applications));
  } catch (error) {
    console.error('Get job applications error:', error);
    return res.status(500).json(errorResponse('Failed to fetch applications'));
  }
};

// Get all applications for HR's jobs (HR/Admin only)
export const getMyJobApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all jobs created by this HR
    const jobs = await prisma.job.findMany({
      where: {
        creatorId: userId,
      },
      select: {
        id: true,
      },
    });

    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length === 0) {
      return res.json(successResponse([]));
    }

    // Get all applications for these jobs
    const applications = await prisma.application.findMany({
      where: {
        jobId: {
          in: jobIds,
        },
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
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
            workExperiences: {
              orderBy: {
                startDate: 'desc',
              },
              take: 3,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(successResponse(applications));
  } catch (error) {
    console.error('Get my job applications error:', error);
    return res.status(500).json(errorResponse('Failed to fetch applications'));
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            requiredSkills: {
              include: {
                skill: true,
              },
            },
            creator: {
              select: {
                id: true,
                email: true,
                telegramUsername: true,
              },
            },
          },
        },
        candidateProfile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                telegramUsername: true,
              },
            },
            skills: {
              include: {
                skill: true,
              },
            },
            workExperiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            educations: {
              orderBy: {
                startDate: 'desc',
              },
            },
            certificates: {
              orderBy: {
                issueDate: 'desc',
              },
            },
          },
        },
        feedbacks: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        statusHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    // Check permissions
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (req.user.role === 'CANDIDATE') {
      if (!user?.profile || application.candidateProfileId !== user.profile.id) {
        return res.status(403).json(errorResponse('Permission denied'));
      }
    } else if (req.user.role === 'HR' || req.user.role === 'ADMIN') {
      if (application.job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json(errorResponse('Permission denied'));
      }
    }

    const feedbacksRaw = application.feedbacks || [];
    const feedbacks = feedbacksRaw.map((f) => ({
      ...f,
      criteriaRatings: f.criteriaRatings ? (typeof f.criteriaRatings === 'string' ? JSON.parse(f.criteriaRatings) : f.criteriaRatings) : null,
    }));
    const effectiveRating = (f) => {
      if (f.criteriaRatings && Object.keys(f.criteriaRatings).length > 0) {
        const values = Object.values(f.criteriaRatings).filter((v) => typeof v === 'number' && v >= 1 && v <= 10);
        if (values.length > 0) return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      }
      return f.rating;
    };
    const averageRating =
      feedbacks.length > 0
        ? Math.round((feedbacks.reduce((sum, f) => sum + effectiveRating(f), 0) / feedbacks.length) * 10) / 10
        : null;
    const criteriaKeys = ['communication', 'speed', 'transparency', 'professionalism'];
    const averageRatingsByCriterion = {};
    criteriaKeys.forEach((key) => {
      const withKey = feedbacks.filter((f) => f.criteriaRatings && f.criteriaRatings[key] != null);
      if (withKey.length > 0) {
        const avg = withKey.reduce((s, f) => s + f.criteriaRatings[key], 0) / withKey.length;
        averageRatingsByCriterion[key] = Math.round(avg * 10) / 10;
      }
    });

    return res.json(
      successResponse({
        ...application,
        feedbacks,
        statusHistory: buildStatusHistoryWithFallback(application),
        averageRating,
        averageRatingsByCriterion: Object.keys(averageRatingsByCriterion).length ? averageRatingsByCriterion : null,
      })
    );
  } catch (error) {
    console.error('Get application by ID error:', error);
    return res.status(500).json(errorResponse('Failed to fetch application'));
  }
};

const APPLICATION_STATUSES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED'];
const FEEDBACK_ALLOWED_STATUSES = ['HIRED', 'REJECTED'];

// Update application status (HR/Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json(errorResponse(`Invalid status. Allowed: ${APPLICATION_STATUSES.join(', ')}`));
    }

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    // Check permission
    if (application.job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    if (application.status === status) {
      return res.json(successResponse(application, 'Application status remains unchanged'));
    }

    const updated = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        candidateProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: updated.id,
        fromStatus: application.status,
        toStatus: status,
        changedById: req.user.id,
        changedByRole: req.user.role,
      },
    });

    return res.json(successResponse(updated, 'Application status updated successfully'));
  } catch (error) {
    console.error('Update application status error:', error);
    return res.status(500).json(errorResponse('Failed to update application status'));
  }
};

// Submit feedback for a completed application (HR or CANDIDATE; only when status is HIRED or REJECTED)
export const submitApplicationFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating: rawRating, comment, criteriaRatings } = req.body;
    const applicationId = parseInt(id);
    const criteriaJson = criteriaRatings && typeof criteriaRatings === 'object'
      ? JSON.stringify(criteriaRatings)
      : null;

    const criteriaValues = criteriaRatings && typeof criteriaRatings === 'object'
      ? Object.values(criteriaRatings).filter((v) => typeof v === 'number' && v >= 1 && v <= 10)
      : [];
    const rating =
      criteriaValues.length > 0
        ? Math.round(criteriaValues.reduce((a, b) => a + b, 0) / criteriaValues.length)
        : rawRating;    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        candidateProfile: true,
      },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    if (!FEEDBACK_ALLOWED_STATUSES.includes(application.status)) {
      return res.status(400).json(
        errorResponse('Feedback can only be submitted after the process is completed (status HIRED or REJECTED)')
      );
    }

    const isCandidate = req.user.role === 'CANDIDATE';
    const isHR = req.user.role === 'HR' || req.user.role === 'ADMIN';

    if (isCandidate) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true },
      });
      if (!user?.profile || application.candidateProfileId !== user.profile.id) {
        return res.status(403).json(errorResponse('You can only leave feedback on your own application'));
      }
    } else if (isHR) {
      if (application.job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json(errorResponse('You can only leave feedback on applications to your jobs'));
      }
    } else {
      return res.status(403).json(errorResponse('Only HR or Candidate can leave feedback'));
    }

    const existing = await prisma.applicationFeedback.findUnique({
      where: {
        applicationId_authorId: { applicationId, authorId: req.user.id },
      },
    });
    if (existing) {
      return res.status(400).json(errorResponse('You have already submitted feedback for this application'));
    }

    const authorRole = req.user.role === 'CANDIDATE' ? 'CANDIDATE' : 'HR';
    const targetRole = authorRole === 'CANDIDATE' ? 'HR' : 'CANDIDATE';

    const feedback = await prisma.applicationFeedback.create({
      data: {
        applicationId,
        authorId: req.user.id,
        authorRole,
        targetRole,
        rating,
        comment: comment ?? null,
        criteriaRatings: criteriaJson,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
    const out = { ...feedback, criteriaRatings: criteriaJson ? JSON.parse(criteriaJson) : null };

    return res.status(201).json(successResponse(out, 'Feedback submitted successfully'));
  } catch (error) {
    console.error('Submit application feedback error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('You have already submitted feedback for this application'));
    }
    return res.status(500).json(errorResponse('Failed to submit feedback'));
  }
};

// Get feedbacks for an application (participants only: HR who owns the job or the candidate)
export const getApplicationFeedbacks = async (req, res) => {
  try {
    const { id } = req.params;
    const applicationId = parseInt(id);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        candidateProfile: true,
      },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const isCandidate = req.user.role === 'CANDIDATE';
    const isHR = req.user.role === 'HR' || req.user.role === 'ADMIN';

    if (isCandidate) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true },
      });
      if (!user?.profile || application.candidateProfileId !== user.profile.id) {
        return res.status(403).json(errorResponse('Permission denied'));
      }
    } else if (isHR) {
      if (application.job.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json(errorResponse('Permission denied'));
      }
    } else {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    const feedbacksRaw = await prisma.applicationFeedback.findMany({
      where: { applicationId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const feedbacks = feedbacksRaw.map((f) => ({
      ...f,
      criteriaRatings: f.criteriaRatings ? (typeof f.criteriaRatings === 'string' ? JSON.parse(f.criteriaRatings) : f.criteriaRatings) : null,
    }));

    const effectiveRating = (f) => {
      if (f.criteriaRatings && Object.keys(f.criteriaRatings).length > 0) {
        const values = Object.values(f.criteriaRatings).filter((v) => typeof v === 'number' && v >= 1 && v <= 10);
        if (values.length > 0) return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      }
      return f.rating;
    };
    const averageRating =
      feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + effectiveRating(f), 0) / feedbacks.length
        : null;

    const criteriaKeys = ['communication', 'speed', 'transparency', 'professionalism'];
    const averageRatingsByCriterion = {};
    criteriaKeys.forEach((key) => {
      const withKey = feedbacks.filter((f) => f.criteriaRatings && f.criteriaRatings[key] != null);
      if (withKey.length > 0) {
        const avg = withKey.reduce((s, f) => s + f.criteriaRatings[key], 0) / withKey.length;
        averageRatingsByCriterion[key] = Math.round(avg * 10) / 10;
      }
    });

    return res.json(
      successResponse({
        feedbacks,
        averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
        averageRatingsByCriterion: Object.keys(averageRatingsByCriterion).length ? averageRatingsByCriterion : null,
      })
    );
  } catch (error) {
    console.error('Get application feedbacks error:', error);
    return res.status(500).json(errorResponse('Failed to fetch feedbacks'));
  }
};
