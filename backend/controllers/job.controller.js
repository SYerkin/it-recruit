import { Job } from '../models/Job.js';

// Получить все вакансии
export const getJobs = async (req, res) => {
  try {
    const { status, profession, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (profession) filter.profession = profession;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter)
      .populate('profession')
      .populate('technologies')
      .populate('createdBy', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить вакансию по ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('profession')
      .populate('technologies')
      .populate('createdBy', 'firstName lastName email phone');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать вакансию (только HR и Admin)
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const job = new Job(jobData);
    await job.save();
    await job.populate('profession');
    await job.populate('technologies');

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить вакансию
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Проверка прав: только создатель или admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    Object.assign(job, req.body);
    await job.save();
    await job.populate('profession');
    await job.populate('technologies');

    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить вакансию
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Проверка прав: только создатель или admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

