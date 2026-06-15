import { register, login } from '../services/auth.service.js';

// Регистрация
export const registerUser = async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Авторизация
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    const result = await login(identifier, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Получение текущего пользователя
export const getCurrentUser = async (req, res) => {
  try {
    const { getUserById } = await import('../services/auth.service.js');
    const user = await getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      position: user.position,
      skills: user.skills,
      profession: user.profession,
      experience: user.experience,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

