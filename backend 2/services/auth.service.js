import jwt from 'jsonwebtoken';
import { getDBType } from '../config/database.js';
import { User } from '../models/User.js';
import { UserSQLite } from '../models/sqlite/User.sqlite.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const getUserModel = () => {
  return getDBType() === 'sqlite' ? UserSQLite : User;
};

// Генерация JWT токена
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Верификация JWT токена
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Регистрация пользователя
export const register = async (userData) => {
  const { email, phone, password, role, ...otherData } = userData;
  const UserModel = getUserModel();

  // Проверка, что указан email или phone
  if (!email && !phone) {
    throw new Error('Either email or phone must be provided');
  }

  // Проверка существования пользователя
  let existingUser;
  if (getDBType() === 'sqlite') {
    existingUser = UserModel.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });
  } else {
    existingUser = await UserModel.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });
  }

  if (existingUser) {
    throw new Error('User with this email or phone already exists');
  }

  // Создание пользователя
  let user;
  if (getDBType() === 'sqlite') {
    user = await UserModel.create({
      email,
      phone,
      password,
      role: role || 'candidate',
      ...otherData,
    });
  } else {
    user = new UserModel({
      email,
      phone,
      password,
      role: role || 'candidate',
      ...otherData,
    });
    await user.save();
  }

  // Генерация токена
  const userId = user._id || user.id;
  const token = generateToken(userId, user.role);

  return {
    user: {
      id: userId,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  };
};

// Авторизация пользователя
export const login = async (identifier, password) => {
  const UserModel = getUserModel();
  
  // Поиск пользователя по email или phone
  let user;
  if (getDBType() === 'sqlite') {
    user = UserModel.findOneWithPassword({
      $or: [
        { email: identifier },
        { phone: identifier },
      ],
    });
  } else {
    user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
      ],
    }).select('+password').populate('skills').populate('profession');
  }

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Проверка пароля
  let isPasswordValid;
  if (getDBType() === 'sqlite') {
    isPasswordValid = await UserModel.comparePassword(user, password);
  } else {
    isPasswordValid = await user.comparePassword(password);
  }
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Генерация токена
  const userId = user._id || user.id;
  const token = generateToken(userId, user.role);

  return {
    user: {
      id: userId,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  };
};

// Получение пользователя по ID
export const getUserById = async (userId) => {
  const UserModel = getUserModel();
  
  if (getDBType() === 'sqlite') {
    return UserModel.findById(userId);
  } else {
    return await UserModel.findById(userId);
  }
};

