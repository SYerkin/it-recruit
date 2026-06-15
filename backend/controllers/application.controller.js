import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';

// Получить все заявки
export const getApplications = async (req, res) => {
  try {
    const { status, job, candidate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (job) filter.job = job;
    if (candidate) filter.candidate = candidate;

    // Если пользователь - кандидат, показываем только его заявки
    if (req.user && req.user.role === 'candidate') {
      filter.candidate = req.user.id;
    }

    // Если пользователь - HR, показываем заявки на его вакансии
    if (req.user && req.user.role === 'hr') {
      const hrJobs = await Job.find({ createdBy: req.user.id }).select('_id');
      filter.job = { $in: hrJobs.map(j => j._id) };
    }

    const applications = await Application.find(filter)
      .populate('job', 'title company profession')
      .populate('candidate', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить заявку по ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Проверка прав доступа
    if (req.user) {
      const isCandidate = req.user.role === 'candidate' && 
        application.candidate._id.toString() === req.user.id;
      const isHR = req.user.role === 'hr' || req.user.role === 'admin';
      
      if (!isCandidate && !isHR) {
        return res.status(403).json({ error: 'Permission denied' });
      }
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать заявку (только для кандидатов)
export const createApplication = async (req, res) => {
  try {
    // Проверка, что пользователь - кандидат
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ error: 'Only candidates can create applications' });
    }

    // Проверка существования вакансии
    const job = await Job.findById(req.body.job);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Проверка, что заявка еще не существует
    const existingApplication = await Application.findOne({
      job: req.body.job,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Application already exists' });
    }

    const application = new Application({
      ...req.body,
      candidate: req.user.id,
    });

    await application.save();
    await application.populate('job');
    await application.populate('candidate');

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить заявку
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Кандидат может обновлять только свои заявки
    if (req.user.role === 'candidate') {
      if (application.candidate.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      // Кандидат может обновлять только определенные поля
      const allowedFields = ['coverLetter', 'resume'];
      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
      Object.assign(application, updateData);
    } else {
      // HR и Admin могут обновлять все поля
      Object.assign(application, req.body);
    }

    await application.save();
    await application.populate('job');
    await application.populate('candidate');

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить заявку
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Кандидат может удалять только свои заявки
    if (req.user.role === 'candidate') {
      if (application.candidate.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Permission denied' });
      }
    }

    await application.deleteOne();
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

