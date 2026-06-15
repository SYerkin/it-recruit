import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

const safeJsonParse = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

// Create company (HR only)
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      address2gis,
      logoUrl,
      website,
      industry,
      socialLinks,
      foundedYear,
      employeeCount,
      documents,
      officePhotos,
    } = req.body;
    const userId = req.user.id;

    // Check if user already has a company
    const existingCompany = await prisma.company.findUnique({
      where: { ownerId: userId },
    });

    if (existingCompany) {
      return res.status(400).json(errorResponse('You already have a company'));
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name,
        description,
        address,
        address2gis,
        logoUrl,
        website,
        industry,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        employeeCount,
        documents: documents ? JSON.stringify(documents) : null,
        officePhotos: officePhotos ? JSON.stringify(officePhotos) : null,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json(successResponse(company, 'Company created successfully'));
  } catch (error) {
    console.error('Create company error:', error);
    return res.status(500).json(errorResponse('Failed to create company'));
  }
};

// Get my company (HR only)
export const getMyCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await prisma.company.findUnique({
      where: { ownerId: userId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json(errorResponse('Company not found'));
    }

    // Parse documents and officePhotos if exists
    const companyData = {
      ...company,
      socialLinks: safeJsonParse(company.socialLinks),
      documents: company.documents ? JSON.parse(company.documents) : null,
      officePhotos: company.officePhotos ? JSON.parse(company.officePhotos) : null,
    };

    return res.json(successResponse(companyData));
  } catch (error) {
    console.error('Get company error:', error);
    return res.status(500).json(errorResponse('Failed to get company'));
  }
};

// Update company (HR only)
export const updateCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      address2gis,
      logoUrl,
      website,
      industry,
      socialLinks,
      foundedYear,
      employeeCount,
      documents,
      officePhotos,
    } = req.body;
    const userId = req.user.id;

    const company = await prisma.company.findUnique({
      where: { ownerId: userId },
    });

    if (!company) {
      return res.status(404).json(errorResponse('Company not found'));
    }

    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(address !== undefined && { address }),
        ...(address2gis !== undefined && { address2gis }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(website !== undefined && { website }),
        ...(industry !== undefined && { industry }),
        ...(socialLinks !== undefined && { socialLinks: socialLinks ? JSON.stringify(socialLinks) : null }),
        ...(foundedYear !== undefined && { foundedYear: foundedYear ? parseInt(foundedYear) : null }),
        ...(employeeCount !== undefined && { employeeCount }),
        ...(documents !== undefined && { documents: documents ? JSON.stringify(documents) : null }),
        ...(officePhotos !== undefined && { officePhotos: officePhotos ? JSON.stringify(officePhotos) : null }),
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const companyData = {
      ...updatedCompany,
      socialLinks: safeJsonParse(updatedCompany.socialLinks),
      documents: safeJsonParse(updatedCompany.documents),
      officePhotos: safeJsonParse(updatedCompany.officePhotos),
    };

    return res.json(successResponse(companyData, 'Company updated successfully'));
  } catch (error) {
    console.error('Update company error:', error);
    return res.status(500).json(errorResponse('Failed to update company'));
  }
};

// Get all companies (public)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        jobs: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const companiesData = companies.map((company) => ({
      ...company,
      socialLinks: safeJsonParse(company.socialLinks),
      documents: safeJsonParse(company.documents),
      officePhotos: safeJsonParse(company.officePhotos),
    }));

    return res.json(successResponse(companiesData));
  } catch (error) {
    console.error('Get all companies error:', error);
    return res.status(500).json(errorResponse('Failed to fetch companies'));
  }
};

// Get featured companies (top companies with most active jobs)
export const getFeaturedCompanies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const companies = await prisma.company.findMany({
      where: {
        jobs: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
      orderBy: {
        jobs: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    const companiesData = companies.map((company) => ({
      id: company.id,
      name: company.name,
      address: company.address,
      employeeCount: company.employeeCount,
      activeJobsCount: company._count.jobs,
    }));

    return res.json(successResponse(companiesData));
  } catch (error) {
    console.error('Get featured companies error:', error);
    return res.status(500).json(errorResponse('Failed to fetch featured companies'));
  }
};

// Get company by ID (public)
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that id is a number
    const companyId = parseInt(id);
    if (isNaN(companyId)) {
      return res.status(400).json(errorResponse('Invalid company ID'));
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        jobs: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            title: true,
            description: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
            createdAt: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json(errorResponse('Company not found'));
    }

    const companyData = {
      ...company,
      socialLinks: safeJsonParse(company.socialLinks),
      documents: safeJsonParse(company.documents),
      officePhotos: safeJsonParse(company.officePhotos),
    };

    return res.json(successResponse(companyData));
  } catch (error) {
    console.error('Get company by ID error:', error);
    return res.status(500).json(errorResponse('Failed to get company'));
  }
};

export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('Logo file is required'));
    }
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    return res.status(201).json(successResponse({ url: logoUrl }, 'Logo uploaded successfully'));
  } catch (error) {
    console.error('Upload logo error:', error);
    return res.status(500).json(errorResponse('Failed to upload logo'));
  }
};

export const uploadCompanyDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('Document file is required'));
    }
    const documentUrl = `/uploads/documents/${req.file.filename}`;
    return res.status(201).json(successResponse({ url: documentUrl, name: req.file.originalname }, 'Document uploaded successfully'));
  } catch (error) {
    console.error('Upload document error:', error);
    return res.status(500).json(errorResponse('Failed to upload document'));
  }
};

export const createVerificationRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documents, comment } = req.body;
    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json(errorResponse('At least one document is required'));
    }

    const company = await prisma.company.findUnique({ where: { ownerId: userId } });
    if (!company) {
      return res.status(404).json(errorResponse('Company not found'));
    }

    const existingPending = await prisma.verificationRequest.findFirst({
      where: { companyId: company.id, status: 'PENDING' },
    });
    if (existingPending) {
      return res.status(400).json(errorResponse('Verification request is already pending'));
    }

    const request = await prisma.verificationRequest.create({
      data: {
        companyId: company.id,
        submittedById: userId,
        documents: JSON.stringify(documents),
        comment: comment ?? null,
      },
    });

    return res.status(201).json(
      successResponse(
        { ...request, documents: safeJsonParse(request.documents, []) },
        'Verification request submitted successfully'
      )
    );
  } catch (error) {
    console.error('Create verification request error:', error);
    return res.status(500).json(errorResponse('Failed to create verification request'));
  }
};

export const getCompanyVerificationStatus = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
    if (Number.isNaN(companyId)) {
      return res.status(400).json(errorResponse('Invalid company ID'));
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, isVerified: true },
    });
    if (!company) {
      return res.status(404).json(errorResponse('Company not found'));
    }

    const lastRequest = await prisma.verificationRequest.findFirst({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(
      successResponse({
        isVerified: company.isVerified,
        request: lastRequest
          ? { ...lastRequest, documents: safeJsonParse(lastRequest.documents, []) }
          : null,
      })
    );
  } catch (error) {
    console.error('Get verification status error:', error);
    return res.status(500).json(errorResponse('Failed to get verification status'));
  }
};

export const getCompanyHrReviews = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
    if (Number.isNaN(companyId)) {
      return res.status(400).json(errorResponse('Invalid company ID'));
    }

    const feedbacks = await prisma.applicationFeedback.findMany({
      where: {
        isVisible: true,
        targetRole: 'HR',
        application: {
          job: { companyId },
        },
      },
      include: {
        application: {
          select: {
            id: true,
            job: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const normalized = feedbacks.map((item) => ({
      ...item,
      criteriaRatings: safeJsonParse(item.criteriaRatings, null),
    }));
    const avg = normalized.length
      ? normalized.reduce((sum, item) => sum + item.rating, 0) / normalized.length
      : null;

    return res.json(
      successResponse({
        averageRating: avg ? Math.round(avg * 10) / 10 : null,
        totalReviews: normalized.length,
        reviews: normalized,
      })
    );
  } catch (error) {
    console.error('Get HR reviews error:', error);
    return res.status(500).json(errorResponse('Failed to get HR reviews'));
  }
};

