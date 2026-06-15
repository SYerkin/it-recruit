import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get current user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
          },
        },
      },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    return res.json(successResponse(user.profile));
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json(errorResponse('Failed to fetch profile'));
  }
};

// Update profile (Candidate only)
export const updateMyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can update profile'));
    }

    const { firstName, lastName, phone, headline, summary, cvFileUrl, isOpenToWork, isPublicProfile } = req.body;

    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const profile = await prisma.candidateProfile.update({
      where: { id: user.profile.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(headline !== undefined && { headline }),
        ...(summary !== undefined && { summary }),
        ...(cvFileUrl !== undefined && { cvFileUrl }),
        ...(isOpenToWork !== undefined && { isOpenToWork }),
        ...(isPublicProfile !== undefined && { isPublicProfile }),
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        workExperiences: true,
        educations: true,
      },
    });

    return res.json(successResponse(profile, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json(errorResponse('Failed to update profile'));
  }
};

// Add work experience
export const addExperience = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can add experience'));
    }

    const { companyName, position, startDate, endDate, description } = req.body;

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const experience = await prisma.workExperience.create({
      data: {
        candidateProfileId: user.profile.id,
        companyName,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return res.status(201).json(successResponse(experience, 'Work experience added successfully'));
  } catch (error) {
    console.error('Add experience error:', error);
    return res.status(500).json(errorResponse('Failed to add work experience'));
  }
};

// Update work experience
export const updateExperience = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can update experience'));
    }

    const { id } = req.params;
    const { companyName, position, startDate, endDate, description } = req.body;

    // Check ownership
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const experience = await prisma.workExperience.findUnique({
      where: { id: parseInt(id) },
    });

    if (!experience || experience.candidateProfileId !== user.profile.id) {
      return res.status(404).json(errorResponse('Experience not found'));
    }

    const updated = await prisma.workExperience.update({
      where: { id: parseInt(id) },
      data: {
        ...(companyName && { companyName }),
        ...(position && { position }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(description !== undefined && { description }),
      },
    });

    return res.json(successResponse(updated, 'Experience updated successfully'));
  } catch (error) {
    console.error('Update experience error:', error);
    return res.status(500).json(errorResponse('Failed to update experience'));
  }
};

// Delete work experience
export const deleteExperience = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can delete experience'));
    }

    const { id } = req.params;

    // Check ownership
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const experience = await prisma.workExperience.findUnique({
      where: { id: parseInt(id) },
    });

    if (!experience || experience.candidateProfileId !== user.profile.id) {
      return res.status(404).json(errorResponse('Experience not found'));
    }

    await prisma.workExperience.delete({
      where: { id: parseInt(id) },
    });

    return res.json(successResponse(null, 'Experience deleted successfully'));
  } catch (error) {
    console.error('Delete experience error:', error);
    return res.status(500).json(errorResponse('Failed to delete experience'));
  }
};

// Add education
export const addEducation = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can add education'));
    }

    const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const education = await prisma.education.create({
      data: {
        candidateProfileId: user.profile.id,
        institution,
        degree,
        fieldOfStudy,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return res.status(201).json(successResponse(education, 'Education added successfully'));
  } catch (error) {
    console.error('Add education error:', error);
    return res.status(500).json(errorResponse('Failed to add education'));
  }
};

// Update education
export const updateEducation = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can update education'));
    }

    const { id } = req.params;
    const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const education = await prisma.education.findUnique({
      where: { id: parseInt(id) },
    });

    if (!education || education.candidateProfileId !== user.profile.id) {
      return res.status(404).json(errorResponse('Education not found'));
    }

    const updated = await prisma.education.update({
      where: { id: parseInt(id) },
      data: {
        ...(institution && { institution }),
        ...(degree !== undefined && { degree }),
        ...(fieldOfStudy !== undefined && { fieldOfStudy }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(description !== undefined && { description }),
      },
    });

    return res.json(successResponse(updated, 'Education updated successfully'));
  } catch (error) {
    console.error('Update education error:', error);
    return res.status(500).json(errorResponse('Failed to update education'));
  }
};

// Delete education
export const deleteEducation = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can delete education'));
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const education = await prisma.education.findUnique({
      where: { id: parseInt(id) },
    });

    if (!education || education.candidateProfileId !== user.profile.id) {
      return res.status(404).json(errorResponse('Education not found'));
    }

    await prisma.education.delete({
      where: { id: parseInt(id) },
    });

    return res.json(successResponse(null, 'Education deleted successfully'));
  } catch (error) {
    console.error('Delete education error:', error);
    return res.status(500).json(errorResponse('Failed to delete education'));
  }
};

