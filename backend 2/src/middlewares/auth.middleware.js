import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware для проверки аутентификации
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // Убираем "Bearer "

    // Верификация токена
    const decoded = jwt.verify(token, JWT_SECRET);

    // Получение пользователя из базы
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Добавление информации о пользователе в запрос
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    return res.status(401).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

// Middleware для проверки ролей
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Комбинированный middleware для аутентификации и авторизации
export const requireAuth = (allowedRoles) => {
  return [
    authenticate,
    ...(allowedRoles ? [authorize(...allowedRoles)] : []),
  ];
};

