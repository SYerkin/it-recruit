import { Technology } from '../models/Technology.js';

// Получить все технологии
export const getTechnologies = async (req, res) => {
  try {
    const { isActive, category } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (category) {
      filter.category = category;
    }

    const technologies = await Technology.find(filter).sort({ name: 1 });
    res.json(technologies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить технологию по ID
export const getTechnologyById = async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology) {
      return res.status(404).json({ error: 'Technology not found' });
    }
    res.json(technology);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать технологию (только Admin)
export const createTechnology = async (req, res) => {
  try {
    const technology = new Technology(req.body);
    await technology.save();
    res.status(201).json(technology);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить технологию (только Admin)
export const updateTechnology = async (req, res) => {
  try {
    const technology = await Technology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!technology) {
      return res.status(404).json({ error: 'Technology not found' });
    }
    res.json(technology);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить технологию (только Admin)
export const deleteTechnology = async (req, res) => {
  try {
    const technology = await Technology.findByIdAndDelete(req.params.id);
    if (!technology) {
      return res.status(404).json({ error: 'Technology not found' });
    }
    res.json({ message: 'Technology deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

