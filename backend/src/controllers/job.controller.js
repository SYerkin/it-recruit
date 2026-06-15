import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { rankCandidatesForJob } from '../utils/matching.js';

// Get jobs with smart filtering
export const getJobs = async (req, res) => {
  try {
    const { search, minSalary, skill, status, companyId } = req.query;
    
    console.log('Get jobs request:', { search, minSalary, skill, status, companyId });

    const where = {};
    const searchConditions = [];

    // Status filter
    if (status) {
      where.status = status;
    }

    // Company filter
    if (companyId) {
      where.companyId = parseInt(companyId);
    }

    // Search in title/description (используем OR для поиска)
    // Для SQLite contains работает без mode
    if (search) {
      searchConditions.push(
        { title: { contains: search } },
        { description: { contains: search } }
      );
    }

    // Min salary filter (AND условие - должна быть хотя бы одна зарплата >= minSalary)
    const salaryConditions = [];
    if (minSalary) {
      const salary = parseInt(minSalary);
      salaryConditions.push(
        { salaryMin: { gte: salary } },
        { salaryMax: { gte: salary } }
      );
    }

    // Объединяем условия через AND если есть несколько фильтров
    const andConditions = [];
    
    if (searchConditions.length > 0) {
      andConditions.push({ OR: searchConditions });
    }
    
    if (salaryConditions.length > 0) {
      andConditions.push({ OR: salaryConditions });
    }
    
    if (andConditions.length > 0) {
      where.AND = andConditions;
    } else if (searchConditions.length > 0) {
      where.OR = searchConditions;
    }

    // Skill filter
    if (skill) {
      where.requiredSkills = {
        some: {
          skill: {
            name: { contains: skill },
          },
        },
      };
    }

    console.log('Prisma where clause:', JSON.stringify(where, null, 2));

    // Determine order by - trending if requested
    const orderBy = req.query.trending === 'true' 
      ? [
          { viewsCount: 'desc' },
          { createdAt: 'desc' },
        ]
      : { createdAt: 'desc' };

    // Get limit if provided
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    const jobs = await prisma.job.findMany({
      where,
      ...(limit && { take: limit }),
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            address: true,
            employeeCount: true,
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy,
    });

    console.log(`Found ${jobs.length} jobs`);
    return res.json(successResponse(jobs));
  } catch (error) {
    console.error('Get jobs error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return res.status(500).json(errorResponse(error.message || 'Failed to fetch jobs'));
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            address: true,
            description: true,
            employeeCount: true,
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    // Увеличиваем счётчик просмотров (не считаем просмотры создателя)
    const userId = req.user?.id;
    if (!userId || job.creatorId !== userId) {
      await prisma.job.update({
        where: { id: parseInt(id) },
        data: { viewsCount: { increment: 1 } },
      });
      job.viewsCount = (job.viewsCount || 0) + 1;
    }

    return res.json(successResponse(job));
  } catch (error) {
    console.error('Get job by ID error:', error);
    return res.status(500).json(errorResponse('Failed to fetch job'));
  }
};

// Create job (HR/Admin only)
export const createJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      responsibilities,
      benefits,
      salaryMin, 
      salaryMax, 
      currency, 
      status, 
      requiredSkillIds, 
      companyId,
      workSchedule,
      workMode,
      workType,
      experienceLevel
    } = req.body;
    const userId = req.user.id;

    // Get user's company if companyId not provided
    let finalCompanyId = companyId;
    if (!finalCompanyId) {
      const company = await prisma.company.findUnique({
        where: { ownerId: userId },
      });
      
      if (!company) {
        return res.status(400).json(errorResponse('You need to create a company first'));
      }
      
      finalCompanyId = company.id;
    } else {
      // Verify user owns the company
      const company = await prisma.company.findUnique({
        where: { id: finalCompanyId },
      });
      
      if (!company || company.ownerId !== userId) {
        return res.status(403).json(errorResponse('You can only create jobs for your own company'));
      }
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        responsibilities,
        benefits,
        salaryMin,
        salaryMax,
        currency,
        status: status || 'DRAFT',
        workSchedule,
        workMode,
        workType,
        experienceLevel,
        creatorId: userId,
        companyId: finalCompanyId,
        requiredSkills: requiredSkillIds
          ? {
              create: requiredSkillIds.map((skillId) => ({
                skillId,
              })),
            }
          : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            address: true,
            employeeCount: true,
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return res.status(201).json(successResponse(job, 'Job created successfully'));
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json(errorResponse('Failed to create job'));
  }
};

// Update job (HR/Admin only)
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      responsibilities,
      benefits,
      salaryMin, 
      salaryMax, 
      currency, 
      status, 
      requiredSkillIds,
      workSchedule,
      workMode,
      workType,
      experienceLevel
    } = req.body;

    // Check if job exists and user has permission
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    if (existingJob.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    // Update job
    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(responsibilities !== undefined && { responsibilities }),
        ...(benefits !== undefined && { benefits }),
        ...(salaryMin !== undefined && { salaryMin }),
        ...(salaryMax !== undefined && { salaryMax }),
        ...(currency && { currency }),
        ...(status && { status }),
        ...(workSchedule !== undefined && { workSchedule }),
        ...(workMode !== undefined && { workMode }),
        ...(workType !== undefined && { workType }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        // Update skills if provided
        ...(requiredSkillIds && {
          requiredSkills: {
            deleteMany: {},
            create: requiredSkillIds.map((skillId) => ({
              skillId,
            })),
          },
        }),
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            address: true,
            employeeCount: true,
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return res.json(successResponse(job, 'Job updated successfully'));
  } catch (error) {
    console.error('Update job error:', error);
    return res.status(500).json(errorResponse('Failed to update job'));
  }
};

// Get top recommended candidates for a job (HR/Admin only)
export const getRecommendedCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 3, 10);

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    const candidates = await prisma.candidateProfile.findMany({
      where: {
        isPublicProfile: true,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    const recommendations = rankCandidatesForJob(job, candidates, limit);

    return res.json(successResponse(recommendations));
  } catch (error) {
    console.error('Get recommended candidates error:', error);
    return res.status(500).json(errorResponse('Failed to fetch recommended candidates'));
  }
};

