import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get my favorite jobs
export const getMyFavoriteJobs = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can view favorite jobs'));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const favorites = await prisma.favoriteJob.findMany({
      where: { candidateProfileId: user.profile.id },
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const jobs = favorites.map((f) => f.job);

    return res.json(successResponse(jobs));
  } catch (error) {
    console.error('Get favorite jobs error:', error);
    return res.status(500).json(errorResponse('Failed to fetch favorite jobs'));
  }
};

// Add job to favorites
export const addFavoriteJob = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can add favorite jobs'));
    }

    const { jobId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    // Check if already favorited
    const existing = await prisma.favoriteJob.findUnique({
      where: {
        candidateProfileId_jobId: {
          candidateProfileId: user.profile.id,
          jobId: parseInt(jobId),
        },
      },
    });

    if (existing) {
      return res.status(400).json(errorResponse('Job already in favorites'));
    }

    await prisma.favoriteJob.create({
      data: {
        candidateProfileId: user.profile.id,
        jobId: parseInt(jobId),
      },
    });

    return res.status(201).json(successResponse(null, 'Job added to favorites'));
  } catch (error) {
    console.error('Add favorite job error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('Job already in favorites'));
    }
    return res.status(500).json(errorResponse('Failed to add favorite job'));
  }
};

// Remove job from favorites
export const removeFavoriteJob = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can remove favorite jobs'));
    }

    const { jobId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    await prisma.favoriteJob.delete({
      where: {
        candidateProfileId_jobId: {
          candidateProfileId: user.profile.id,
          jobId: parseInt(jobId),
        },
      },
    });

    return res.json(successResponse(null, 'Job removed from favorites'));
  } catch (error) {
    console.error('Remove favorite job error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json(errorResponse('Favorite not found'));
    }
    return res.status(500).json(errorResponse('Failed to remove favorite job'));
  }
};

// Check if job is favorited
export const checkFavoriteJob = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.json(successResponse({ isFavorite: false }));
    }

    const { jobId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.json(successResponse({ isFavorite: false }));
    }

    const favorite = await prisma.favoriteJob.findUnique({
      where: {
        candidateProfileId_jobId: {
          candidateProfileId: user.profile.id,
          jobId: parseInt(jobId),
        },
      },
    });

    return res.json(successResponse({ isFavorite: !!favorite }));
  } catch (error) {
    console.error('Check favorite job error:', error);
    return res.json(successResponse({ isFavorite: false }));
  }
};

