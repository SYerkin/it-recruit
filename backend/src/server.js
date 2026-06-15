import app from './app.js';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();
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

// Test database connection
async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    if (process.env.NODE_ENV !== 'production') {
      await killPort(PORT);
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'SQLite'}`);
    });
  })
  .catch(async (error) => {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

