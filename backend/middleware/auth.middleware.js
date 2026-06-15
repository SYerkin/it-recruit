import { verifyToken, getUserById } from '../services/auth.service.js';

// Middleware для проверки аутентификации
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Убираем "Bearer "

    // Верификация токена
    const decoded = verifyToken(token);

    // Получение пользователя
    const user = await getUserById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Добавление информации о пользователе в запрос
    req.user = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware для проверки ролей
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
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

