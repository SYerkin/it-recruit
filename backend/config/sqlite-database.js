import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export const connectSQLite = () => {
  try {
    const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '../data/test.db');
    
    // Создаем директорию если её нет
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging для лучшей производительности
    
    console.log(`SQLite connected: ${dbPath}`);
    
    // Инициализация таблиц
    initializeTables();
    
    return db;
  } catch (error) {
    console.error('SQLite connection error:', error);
    throw error;
  }
};

export const getSQLiteDB = () => {
  if (!db) {
    throw new Error('SQLite database not connected. Call connectSQLite() first.');
  }
  return db;
};

export const closeSQLite = () => {
  if (db) {
    db.close();
    db = null;
    console.log('SQLite connection closed');
  }
};

// Инициализация таблиц
const initializeTables = () => {
  // Таблица пользователей
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'hr', 'candidate')),
      firstName TEXT,
      lastName TEXT,
      isActive INTEGER DEFAULT 1,
      company TEXT,
      position TEXT,
      experience INTEGER DEFAULT 0,
      professionId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      CHECK(email IS NOT NULL OR phone IS NOT NULL)
    )
  `);

  // Таблица профессий
  db.exec(`
    CREATE TABLE IF NOT EXISTS professions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица технологий
  db.exec(`
    CREATE TABLE IF NOT EXISTS technologies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      category TEXT DEFAULT 'other' CHECK(category IN ('frontend', 'backend', 'database', 'devops', 'mobile', 'other')),
      description TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица связи пользователей и технологий
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_technologies (
      userId INTEGER NOT NULL,
      technologyId INTEGER NOT NULL,
      PRIMARY KEY (userId, technologyId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (technologyId) REFERENCES technologies(id) ON DELETE CASCADE
    )
  `);

  // Таблица вакансий
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      salaryMin INTEGER,
      salaryMax INTEGER,
      salaryCurrency TEXT DEFAULT 'USD',
      professionId INTEGER NOT NULL,
      experienceMin INTEGER DEFAULT 0,
      experienceMax INTEGER,
      employmentType TEXT DEFAULT 'full-time' CHECK(employmentType IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'closed', 'archived')),
      createdBy INTEGER NOT NULL,
      requirements TEXT,
      benefits TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professionId) REFERENCES professions(id),
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Таблица связи вакансий и технологий
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_technologies (
      jobId INTEGER NOT NULL,
      technologyId INTEGER NOT NULL,
      PRIMARY KEY (jobId, technologyId),
      FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (technologyId) REFERENCES technologies(id) ON DELETE CASCADE
    )
  `);

  // Таблица заявок
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobId INTEGER NOT NULL,
      candidateId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'interview', 'offer', 'accepted', 'rejected')),
      coverLetter TEXT,
      resume TEXT,
      notes TEXT,
      hrNotes TEXT,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(jobId, candidateId),
      FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (candidateId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Индексы
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    CREATE INDEX IF NOT EXISTS idx_jobs_profession ON jobs(professionId);
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(jobId);
    CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidateId);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  `);

  console.log('SQLite tables initialized');
};

