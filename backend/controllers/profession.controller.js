import { Profession } from '../models/Profession.js';

// Получить все профессии
export const getProfessions = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const professions = await Profession.find(filter).sort({ name: 1 });
    res.json(professions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить профессию по ID
export const getProfessionById = async (req, res) => {
  try {
    const profession = await Profession.findById(req.params.id);
    if (!profession) {
      return res.status(404).json({ error: 'Profession not found' });
    }
    res.json(profession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать профессию (только Admin)
export const createProfession = async (req, res) => {
  try {
    const profession = new Profession(req.body);
    await profession.save();
    res.status(201).json(profession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить профессию (только Admin)
export const updateProfession = async (req, res) => {
  try {
    const profession = await Profession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!profession) {
      return res.status(404).json({ error: 'Profession not found' });
    }
    res.json(profession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить профессию (только Admin)
export const deleteProfession = async (req, res) => {
  try {
    const profession = await Profession.findByIdAndDelete(req.params.id);
    if (!profession) {
      return res.status(404).json({ error: 'Profession not found' });
    }
    res.json({ message: 'Profession deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

