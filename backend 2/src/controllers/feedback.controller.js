import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// POST /api/feedback
export const createFeedback = async (req, res) => {
  try {
    const { name, email, type, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json(errorResponse('name, email and message are required'));
    }

    const validTypes = ['SUGGESTION', 'BUG_REPORT', 'GENERAL'];
    const feedbackType = validTypes.includes(type) ? type : 'GENERAL';

    const feedback = await prisma.feedbackMessage.create({
      data: {
        userId: req.user?.id || null,
        name,
        email,
        type: feedbackType,
        message,
      },
    });

    return res.status(201).json(successResponse(feedback, 'Feedback sent'));
  } catch (error) {
    console.error('createFeedback error:', error);
    return res.status(500).json(errorResponse('Failed to send feedback'));
  }
};

// POST /api/mentor-applications
export const createMentorApplication = async (req, res) => {
  try {
    const { name, email, currentTitle, experienceYears, skills, bio, motivation } = req.body;

    if (!name || !email || !currentTitle || !bio || !motivation) {
      return res.status(400).json(errorResponse('All fields are required'));
    }

    const application = await prisma.mentorApplication.create({
      data: {
        userId: req.user?.id || null,
        name,
        email,
        currentTitle,
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
        skills: skills || '',
        bio,
        motivation,
      },
    });

    return res.status(201).json(successResponse(application, 'Application submitted'));
  } catch (error) {
    console.error('createMentorApplication error:', error);
    return res.status(500).json(errorResponse('Failed to submit application'));
  }
};
