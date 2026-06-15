import { getDBType } from '../config/database.js';

// Адаптер для переключения между MongoDB и SQLite
export const getModel = (modelName) => {
  const dbType = getDBType();
  
  if (dbType === 'sqlite') {
    // Импорт SQLite моделей
    switch (modelName) {
      case 'User':
        return import('./sqlite/User.sqlite.js').then(m => m.UserSQLite);
      case 'Profession':
        return import('./sqlite/Profession.sqlite.js').then(m => m.ProfessionSQLite);
      case 'Technology':
        return import('./sqlite/Technology.sqlite.js').then(m => m.TechnologySQLite);
      default:
        throw new Error(`SQLite model ${modelName} not implemented`);
    }
  } else {
    // Импорт MongoDB моделей
    switch (modelName) {
      case 'User':
        return import('./User.js').then(m => m.User);
      case 'Profession':
        return import('./Profession.js').then(m => m.Profession);
      case 'Technology':
        return import('./Technology.js').then(m => m.Technology);
      case 'Job':
        return import('./Job.js').then(m => m.Job);
      case 'Application':
        return import('./Application.js').then(m => m.Application);
      default:
        throw new Error(`MongoDB model ${modelName} not found`);
    }
  }
};


