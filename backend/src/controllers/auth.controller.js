import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = config.jwtExpiresIn;

// Register
export const register = async (req, res) => {
  try {
    const { email, password, role, telegramUsername } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json(errorResponse('User with this email already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ...(telegramUsername != null && { telegramUsername }),
        // If candidate, create empty profile
        ...(role === 'CANDIDATE' && {
          profile: {
            create: {
              firstName: '',
              lastName: '',
              isOpenToWork: true,
            },
          },
        }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        telegramUsername: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json(successResponse({
      user,
      token,
    }, 'User registered successfully'));
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json(errorResponse('Failed to register user'));
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if identifier is email or phone
    const isEmail = identifier.includes('@');
    
    // Find user by email or phone (through profile)
    let user;
    if (isEmail) {
      // Find by email
      user = await prisma.user.findUnique({
        where: { email: identifier },
        include: {
          profile: true,
        },
      });
    } else {
      // Find by phone through profile - normalize phone (remove spaces, dashes, etc)
      const normalizedPhone = identifier.replace(/[\s\-\(\)\+]/g, '');
      const profile = await prisma.candidateProfile.findFirst({
        where: {
          phone: {
            contains: normalizedPhone,
          },
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });
      user = profile?.user;
      
      // Also try to find by exact phone match
      if (!user) {
        const exactProfile = await prisma.candidateProfile.findFirst({
          where: { phone: identifier },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });
        user = exactProfile?.user;
      }
    }

    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json(successResponse({
      user: userWithoutPassword,
      token,
    }, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(errorResponse('Failed to login'));
  }
};

// Get current user
export const getMe = async (req, res) => {
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
            workExperiences: true,
            educations: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            employeeCount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return res.json(successResponse(userWithoutPassword));
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json(errorResponse('Failed to get user'));
  }
};

// Update current user (e.g. telegram username)
export const updateMe = async (req, res) => {
  try {
    const { telegramUsername } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(telegramUsername !== undefined && { telegramUsername }) },
      select: {
        id: true,
        email: true,
        role: true,
        telegramUsername: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(successResponse(user, 'Profile updated'));
  } catch (error) {
    console.error('Update me error:', error);
    return res.status(500).json(errorResponse('Failed to update user'));
  }
};

// Сброс / смена пароля на новый (для авторизованного пользователя)
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return res.json(successResponse(null, 'Пароль успешно изменён'));
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json(errorResponse('Не удалось изменить пароль'));
  }
};

// Сброс пароля без входа (по email) — для демо, без проверки безопасности
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
      return res.status(404).json(errorResponse('Пользователь с таким email не найден'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.json(successResponse(null, 'Пароль успешно изменён. Можете войти с новым паролем.'));
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json(errorResponse('Не удалось сбросить пароль'));
  }
};
