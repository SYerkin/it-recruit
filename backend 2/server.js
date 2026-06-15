import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';
import { connectDB } from './config/database.js';
import { authRoutes } from './routes/auth.routes.js';
import { candidateRoutes } from './routes/candidate.routes.js';
import { jobRoutes } from './routes/job.routes.js';
import { applicationRoutes } from './routes/application.routes.js';
import { professionRoutes } from './routes/profession.routes.js';
import { technologyRoutes } from './routes/technology.routes.js';

const execAsync = promisify(exec);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Функция для освобождения порта
async function killPort(port) {
  try {
    // Для macOS и Linux используем lsof
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length > 0) {
      console.log(`🔍 Найдены процессы на порту ${port}: ${pids.join(', ')}`);
      
      for (const pid of pids) {
        try {
          await execAsync(`kill -9 ${pid}`);
          console.log(`✅ Процесс ${pid} успешно завершён`);
        } catch (error) {
          console.warn(`⚠️  Не удалось завершить процесс ${pid}:`, error.message);
        }
      }
      
      // Даём время процессам завершиться
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`✅ Порт ${port} освобождён`);
    } else {
      console.log(`✅ Порт ${port} свободен`);
    }
  } catch (error) {
    // Если lsof не нашёл процессы, значит порт свободен
    if (error.code === 1) {
      console.log(`✅ Порт ${port} свободен`);
    } else {
      console.warn(`⚠️  Ошибка при проверке порта ${port}:`, error.message);
    }
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/professions', professionRoutes);
app.use('/api/technologies', technologyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Запуск сервера с освобождением порта
async function startServer() {
  await killPort(PORT);
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Ошибка при запуске сервера:', error);
  process.exit(1);
});

