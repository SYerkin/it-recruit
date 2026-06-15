import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get public statistics
export const getPublicStats = async (req, res) => {
  try {
    // Count active jobs
    const activeJobsCount = await prisma.job.count({
      where: {
        status: 'ACTIVE',
      },
    });

    // Count companies with active jobs
    const companiesCount = await prisma.company.count({
      where: {
        jobs: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
    });

    // Count candidates (users with CANDIDATE role)
    const candidatesCount = await prisma.user.count({
      where: {
        role: 'CANDIDATE',
      },
    });

    // Calculate average time to offer (mock for now, can be calculated from applications)
    // This would require tracking application -> offer timeline
    const avgTimeToOffer = 3; // days (mock)

    return res.json(successResponse({
      activeJobs: activeJobsCount,
      companies: companiesCount,
      candidates: candidatesCount,
      avgTimeToOffer,
    }));
  } catch (error) {
    console.error('Get public stats error:', error);
    return res.status(500).json(errorResponse('Failed to fetch statistics'));
  }
};
