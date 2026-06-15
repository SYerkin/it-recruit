import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get candidates (HR/Admin only)
export const getCandidates = async (req, res) => {
  try {
    const { skill, isOpenToWork } = req.query;

    const where = {
      profile: {
        isOpenToWork: isOpenToWork === 'true' ? true : isOpenToWork === 'false' ? false : undefined,
      },
    };

    // Filter by skill
    if (skill) {
      where.profile = {
        ...where.profile,
        skills: {
          some: {
            skill: {
              name: { contains: skill },
            },
          },
        },
      };
    }

    // Remove undefined values
    if (!where.profile.isOpenToWork) {
      delete where.profile.isOpenToWork;
    }
    if (!where.profile.skills) {
      delete where.profile.skills;
    }

    const candidates = await prisma.user.findMany({
      where: {
        role: 'CANDIDATE',
        ...where,
      },
      include: {
        profile: {
          include: {
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
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(successResponse(candidates));
  } catch (error) {
    console.error('Get candidates error:', error);
    return res.status(500).json(errorResponse('Failed to fetch candidates'));
  }
};

// Get candidate by ID (HR/Admin only)
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const candidate = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
        role: 'CANDIDATE',
      },
      include: {
        profile: {
          include: {
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
            applications: {
              include: {
                job: {
                  select: {
                    id: true,
                    title: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      return res.status(404).json(errorResponse('Candidate not found'));
    }

    // Увеличиваем счетчик просмотров и фиксируем, какой HR смотрел профиль
    if (userId && candidate.id !== userId && candidate.profile && (req.user.role === 'HR' || req.user.role === 'ADMIN')) {
      await prisma.candidateProfile.update({
        where: { id: candidate.profile.id },
        data: {
          viewsCount: {
            increment: 1,
          },
        },
      });
      await prisma.candidateProfileView.upsert({
        where: {
          candidateProfileId_viewedByUserId: {
            candidateProfileId: candidate.profile.id,
            viewedByUserId: userId,
          },
        },
        update: {
          viewsCount: { increment: 1 },
          lastViewedAt: new Date(),
        },
        create: {
          candidateProfileId: candidate.profile.id,
          viewedByUserId: userId,
          lastViewedAt: new Date(),
        },
      });
      candidate.profile.viewsCount = (candidate.profile.viewsCount || 0) + 1;
    }

    return res.json(successResponse(candidate));
  } catch (error) {
    console.error('Get candidate by ID error:', error);
    return res.status(500).json(errorResponse('Failed to fetch candidate'));
  }
};

// Get profile viewers for current candidate (Candidate only)
export const getMyProfileViewers = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: {
          select: {
            id: true,
            viewsCount: true,
          },
        },
      },
    });

    if (!user?.profile) {
      return res.status(404).json(errorResponse('Candidate profile not found'));
    }

    const viewers = await prisma.candidateProfileView.findMany({
      where: { candidateProfileId: user.profile.id },
      include: {
        viewedBy: {
          select: {
            id: true,
            email: true,
            role: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { lastViewedAt: 'desc' },
      take: 50,
    });

    const result = viewers.map((item) => ({
      id: item.id,
      viewsCount: item.viewsCount,
      firstViewedAt: item.firstViewedAt,
      lastViewedAt: item.lastViewedAt,
      hr: {
        id: item.viewedBy.id,
        email: item.viewedBy.email,
        role: item.viewedBy.role,
        company: item.viewedBy.company ?? null,
      },
    }));

    return res.json(successResponse({
      totalViews: user.profile.viewsCount || 0,
      uniqueViewers: result.length,
      viewers: result,
    }));
  } catch (error) {
    console.error('Get my profile viewers error:', error);
    return res.status(500).json(errorResponse('Failed to fetch profile viewers'));
  }
};

// Get public candidate profile (anonymous, no auth required)
export const getCandidatePublic = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
        role: 'CANDIDATE',
      },
      include: {
        profile: {
          where: {
            isPublicProfile: true, // Only show if profile is public
          },
          include: {
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
          },
        },
      },
    });

    if (!candidate || !candidate.profile) {
      return res.status(404).json(errorResponse('Public profile not found or not available'));
    }

    // Remove sensitive information
    const publicProfile = {
      id: candidate.id,
      profile: {
        id: candidate.profile.id,
        firstName: candidate.profile.firstName,
        lastName: candidate.profile.lastName,
        headline: candidate.profile.headline,
        summary: candidate.profile.summary,
        isOpenToWork: candidate.profile.isOpenToWork,
        skills: candidate.profile.skills.map(s => ({
          skill: s.skill,
          proficiencyLevel: s.proficiencyLevel,
          yearsOfExperience: s.yearsOfExperience,
        })),
        workExperiences: candidate.profile.workExperiences.map(exp => ({
          companyName: exp.companyName,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
        })),
        educations: candidate.profile.educations.map(edu => ({
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
        })),
        // Excluded: phone, cvFileUrl, email
      },
    };

    return res.json(successResponse(publicProfile));
  } catch (error) {
    console.error('Get candidate public error:', error);
    return res.status(500).json(errorResponse('Failed to fetch public profile'));
  }
};

// Get all HR reviews about candidate (HR/Admin only)
export const getCandidateReviews = async (req, res) => {
  try {
    const candidateUserId = parseInt(req.params.id);
    if (Number.isNaN(candidateUserId)) {
      return res.status(400).json(errorResponse('Invalid candidate ID'));
    }

    const candidate = await prisma.user.findUnique({
      where: { id: candidateUserId, role: 'CANDIDATE' },
      include: { profile: { select: { id: true } } },
    });
    if (!candidate?.profile) {
      return res.status(404).json(errorResponse('Candidate not found'));
    }

    const feedbacks = await prisma.applicationFeedback.findMany({
      where: {
        isVisible: true,
        targetRole: 'CANDIDATE',
        application: {
          candidateProfileId: candidate.profile.id,
        },
      },
      include: {
        application: {
          select: {
            id: true,
            status: true,
            job: {
              select: {
                id: true,
                title: true,
                company: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const normalized = feedbacks.map((item) => ({
      ...item,
      criteriaRatings: item.criteriaRatings ? JSON.parse(item.criteriaRatings) : null,
    }));
    const averageRating = normalized.length
      ? Math.round((normalized.reduce((sum, item) => sum + item.rating, 0) / normalized.length) * 10) / 10
      : null;

    return res.json(successResponse({ averageRating, totalReviews: normalized.length, reviews: normalized }));
  } catch (error) {
    console.error('Get candidate reviews error:', error);
    return res.status(500).json(errorResponse('Failed to fetch candidate reviews'));
  }
};
