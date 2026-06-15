import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Add skill to profile with proficiency level
export const addSkillToProfile = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can add skills'));
    }

    const { skillId, proficiencyLevel, yearsOfExperience } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: parseInt(skillId) },
    });

    if (!skill) {
      return res.status(404).json(errorResponse('Skill not found'));
    }

    // Check if already added
    const existing = await prisma.candidateSkill.findFirst({
      where: {
        candidateProfileId: user.profile.id,
        skillId: parseInt(skillId),
      },
    });

    if (existing) {
      return res.status(400).json(errorResponse('Skill already added to profile'));
    }

    const candidateSkill = await prisma.candidateSkill.create({
      data: {
        candidateProfileId: user.profile.id,
        skillId: parseInt(skillId),
        proficiencyLevel: (proficiencyLevel || 'BASIC').toUpperCase(),
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
      },
      include: {
        skill: true,
      },
    });

    return res.status(201).json(successResponse(candidateSkill, 'Skill added successfully'));
  } catch (error) {
    console.error('Add skill error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('Skill already added to profile'));
    }
    return res.status(500).json(errorResponse('Failed to add skill'));
  }
};

// Update skill proficiency level
export const updateSkillProficiency = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can update skills'));
    }

    const { id } = req.params;
    const { proficiencyLevel, yearsOfExperience } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    const candidateSkill = await prisma.candidateSkill.findFirst({
      where: {
        candidateProfileId: user.profile.id,
        skillId: parseInt(id),
      },
    });

    if (!candidateSkill) {
      return res.status(404).json(errorResponse('Skill not found in profile'));
    }

    const updated = await prisma.candidateSkill.updateMany({
      where: {
        candidateProfileId: user.profile.id,
        skillId: parseInt(id),
      },
      data: {
        ...(proficiencyLevel && { proficiencyLevel: proficiencyLevel.toUpperCase() }),
        ...(yearsOfExperience !== undefined && { yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null }),
      },
    });

    const updatedSkill = await prisma.candidateSkill.findFirst({
      where: {
        candidateProfileId: user.profile.id,
        skillId: parseInt(id),
      },
      include: {
        skill: true,
      },
    });

    return res.json(successResponse(updatedSkill, 'Skill proficiency updated successfully'));
  } catch (error) {
    console.error('Update skill proficiency error:', error);
    return res.status(500).json(errorResponse('Failed to update skill proficiency'));
  }
};

// Create skill (Admin/HR only)
export const createSkill = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json(errorResponse('Skill name is required'));
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name: name.trim() },
    });

    if (existingSkill) {
      return res.status(400).json(errorResponse('Skill already exists'));
    }

    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        category: category ? category.toUpperCase() : 'OTHER',
      },
    });

    return res.status(201).json(successResponse(skill, 'Skill created successfully'));
  } catch (error) {
    console.error('Create skill error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json(errorResponse('Skill already exists'));
    }
    return res.status(500).json(errorResponse('Failed to create skill'));
  }
};

// Get all skills (public endpoint)
export const getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = {};
    
    if (category) {
      where.category = category.toUpperCase();
    }
    
    if (search) {
      where.name = { contains: search };
    }
    
    const skills = await prisma.skill.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
    
    return res.json(successResponse(skills));
  } catch (error) {
    console.error('Get all skills error:', error);
    return res.status(500).json(errorResponse('Failed to fetch skills'));
  }
};

// Remove skill from profile
export const removeSkillFromProfile = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') {
      return res.status(403).json(errorResponse('Only candidates can remove skills'));
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    await prisma.candidateSkill.deleteMany({
      where: {
        candidateProfileId: user.profile.id,
        skillId: parseInt(id),
      },
    });

    return res.json(successResponse(null, 'Skill removed successfully'));
  } catch (error) {
    console.error('Remove skill error:', error);
    return res.status(500).json(errorResponse('Failed to remove skill'));
  }
};

