import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Загружаем .env из корня backend (работает при запуске из любой папки)
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import profileRoutes from './routes/profile.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import applicationRoutes from './routes/application.routes.js';
import invitationRoutes from './routes/invitation.routes.js';
import companyRoutes from './routes/company.routes.js';
import skillRoutes from './routes/skill.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import statsRoutes from './routes/stats.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';

const app = express();

// Middleware
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((item) => item.trim()) : '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many auth attempts, try again later' },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/recommendations', recommendationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;

