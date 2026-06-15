import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// GET /api/mentors — список менторов с фильтрацией
export const getMentors = async (req, res) => {
  try {
    const { skill, minPrice, maxPrice, free, search } = req.query;

    const mentors = await prisma.mentor.findMany({
      where: {
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { title: { contains: search } },
            { company: { contains: search } },
            { bio: { contains: search } },
          ],
        }),
        ...(free === 'true' && { pricePerSession: 0 }),
        ...(minPrice && { pricePerSession: { gte: parseInt(minPrice) } }),
        ...(maxPrice && { pricePerSession: { lte: parseInt(maxPrice) } }),
      },
      orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    });

    const result = mentors
      .map((m) => ({
        ...m,
        skills: tryParseJson(m.skills, []),
      }))
      .filter((m) => {
        if (!skill) return true;
        const skills = Array.isArray(m.skills) ? m.skills : [];
        return skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()));
      });

    return res.json(successResponse(result));
  } catch (error) {
    console.error('getMentors error:', error);
    return res.status(500).json(errorResponse('Failed to fetch mentors'));
  }
};

// GET /api/mentors/:id — профиль ментора
export const getMentorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse('Invalid id'));

    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { id: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!mentor) return res.status(404).json(errorResponse('Mentor not found'));

    return res.json(successResponse({ ...mentor, skills: tryParseJson(mentor.skills, []) }));
  } catch (error) {
    console.error('getMentorById error:', error);
    return res.status(500).json(errorResponse('Failed to get mentor'));
  }
};

// POST /api/mentors/:id/request — отправить заявку ментору
export const createMentorRequest = async (req, res) => {
  try {
    const mentorId = parseInt(req.params.id);
    if (isNaN(mentorId)) return res.status(400).json(errorResponse('Invalid id'));

    const { name, email, message, goal } = req.body;
    if (!name || !email || !goal) {
      return res.status(400).json(errorResponse('name, email and goal are required'));
    }

    const mentor = await prisma.mentor.findUnique({ where: { id: mentorId } });
    if (!mentor || !mentor.isActive) return res.status(404).json(errorResponse('Mentor not found'));

    const request = await prisma.mentorRequest.create({
      data: {
        mentorId,
        userId: req.user.id,
        name,
        email,
        message: message || '',
        goal,
        status: mentor.pricePerSession === 0 ? 'CONFIRMED' : 'PENDING',
      },
    });

    return res.status(201).json(successResponse(request, 'Request created'));
  } catch (error) {
    console.error('createMentorRequest error:', error);
    return res.status(500).json(errorResponse('Failed to create request'));
  }
};

// POST /api/mentors/:id/pay — псевдо-оплата сессии
export const payMentorSession = async (req, res) => {
  try {
    const mentorId = parseInt(req.params.id);
    const { requestId, cardNumber, cardHolder } = req.body;

    if (!requestId || !cardNumber || !cardHolder) {
      return res.status(400).json(errorResponse('requestId, cardNumber and cardHolder are required'));
    }

    const request = await prisma.mentorRequest.findFirst({
      where: { id: parseInt(requestId), userId: req.user.id, mentorId },
      include: { mentor: true },
    });

    if (!request) return res.status(404).json(errorResponse('Request not found'));
    if (request.status !== 'PENDING') return res.status(400).json(errorResponse('Request already paid'));

    const cleanCard = cardNumber.replace(/\s/g, '');
    const cardLast4 = cleanCard.slice(-4);

    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        amount: request.mentor.pricePerSession,
        type: 'MENTOR_SESSION',
        mentorRequestId: request.id,
        status: 'COMPLETED',
        cardLast4,
        cardHolder,
      },
    });

    await prisma.mentorRequest.update({
      where: { id: request.id },
      data: { status: 'PAID' },
    });

    return res.json(successResponse({ paymentId: payment.id, cardLast4 }, 'Payment successful'));
  } catch (error) {
    console.error('payMentorSession error:', error);
    return res.status(500).json(errorResponse('Payment failed'));
  }
};

// POST /api/mentors/:id/reviews — оставить отзыв
export const createMentorReview = async (req, res) => {
  try {
    const mentorId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json(errorResponse('rating must be 1–5'));
    }

    const existing = await prisma.mentorReview.findUnique({
      where: { mentorId_userId: { mentorId, userId: req.user.id } },
    });
    if (existing) return res.status(400).json(errorResponse('You already reviewed this mentor'));

    const review = await prisma.mentorReview.create({
      data: { mentorId, userId: req.user.id, rating, comment },
    });

    // Пересчитываем средний рейтинг
    const agg = await prisma.mentorReview.aggregate({
      where: { mentorId },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.mentor.update({
      where: { id: mentorId },
      data: { rating: agg._avg.rating || 0, reviewsCount: agg._count },
    });

    return res.status(201).json(successResponse(review, 'Review created'));
  } catch (error) {
    console.error('createMentorReview error:', error);
    return res.status(500).json(errorResponse('Failed to create review'));
  }
};

// GET /api/mentors/:id/reviews
export const getMentorReviews = async (req, res) => {
  try {
    const mentorId = parseInt(req.params.id);
    const reviews = await prisma.mentorReview.findMany({
      where: { mentorId },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(successResponse(reviews));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to get reviews'));
  }
};

// ── ADMIN ──

// POST /api/mentors — создать ментора
export const createMentor = async (req, res) => {
  try {
    const { name, avatarUrl, title, company, bio, skills, experienceYears, pricePerSession, sessionDuration } = req.body;
    if (!name || !title || !bio) {
      return res.status(400).json(errorResponse('name, title and bio are required'));
    }

    const mentor = await prisma.mentor.create({
      data: {
        name,
        avatarUrl,
        title,
        company,
        bio,
        skills: JSON.stringify(Array.isArray(skills) ? skills : []),
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
        pricePerSession: pricePerSession ? parseInt(pricePerSession) : 0,
        sessionDuration: sessionDuration ? parseInt(sessionDuration) : 60,
      },
    });

    return res.status(201).json(successResponse({ ...mentor, skills: tryParseJson(mentor.skills, []) }, 'Mentor created'));
  } catch (error) {
    console.error('createMentor error:', error);
    return res.status(500).json(errorResponse('Failed to create mentor'));
  }
};

// PUT /api/mentors/:id — обновить ментора
export const updateMentor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.skills !== undefined && { skills: JSON.stringify(Array.isArray(data.skills) ? data.skills : []) }),
        ...(data.experienceYears !== undefined && { experienceYears: parseInt(data.experienceYears) }),
        ...(data.pricePerSession !== undefined && { pricePerSession: parseInt(data.pricePerSession) }),
        ...(data.sessionDuration !== undefined && { sessionDuration: parseInt(data.sessionDuration) }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });

    return res.json(successResponse({ ...mentor, skills: tryParseJson(mentor.skills, []) }, 'Mentor updated'));
  } catch (error) {
    console.error('updateMentor error:', error);
    return res.status(500).json(errorResponse('Failed to update mentor'));
  }
};

// DELETE /api/mentors/:id
export const deleteMentor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.mentor.update({ where: { id }, data: { isActive: false } });
    return res.json(successResponse(null, 'Mentor deactivated'));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to delete mentor'));
  }
};

function tryParseJson(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}
