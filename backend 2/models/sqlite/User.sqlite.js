import { getSQLiteDB } from '../../config/sqlite-database.js';
import bcrypt from 'bcryptjs';

export class UserSQLite {
  static async create(userData) {
    const db = getSQLiteDB();
    const { email, phone, password, role, ...otherData } = userData;

    if (!email && !phone) {
      throw new Error('Either email or phone must be provided');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (email, phone, password, role, firstName, lastName, company, position, experience, professionId, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      email || null,
      phone || null,
      hashedPassword,
      role || 'candidate',
      otherData.firstName || null,
      otherData.lastName || null,
      otherData.company || null,
      otherData.position || null,
      otherData.experience || 0,
      otherData.profession || null,
      otherData.isActive !== undefined ? (otherData.isActive ? 1 : 0) : 1
    );

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const db = getSQLiteDB();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return user ? this.formatUser(user) : null;
  }

  static findOne(query) {
    const db = getSQLiteDB();
    let sql = 'SELECT * FROM users WHERE ';
    const conditions = [];
    const values = [];

    if (query.email) {
      conditions.push('email = ?');
      values.push(query.email);
    }
    if (query.phone) {
      conditions.push('phone = ?');
      values.push(query.phone);
    }
    if (query._id) {
      conditions.push('id = ?');
      values.push(query._id);
    }
    if (query.$or) {
      const orConditions = [];
      query.$or.forEach(condition => {
        if (condition.email) {
          orConditions.push('email = ?');
          values.push(condition.email);
        }
        if (condition.phone) {
          orConditions.push('phone = ?');
          values.push(condition.phone);
        }
      });
      if (orConditions.length > 0) {
        conditions.push(`(${orConditions.join(' OR ')})`);
      }
    }

    if (conditions.length === 0) return null;

    sql += conditions.join(' AND ');
    const user = db.prepare(sql).get(...values);
    return user ? this.formatUser(user) : null;
  }

  static findOneWithPassword(query) {
    const db = getSQLiteDB();
    let sql = 'SELECT * FROM users WHERE ';
    const conditions = [];
    const values = [];

    if (query.$or) {
      const orConditions = [];
      query.$or.forEach(condition => {
        if (condition.email) {
          orConditions.push('email = ?');
          values.push(condition.email);
        }
        if (condition.phone) {
          orConditions.push('phone = ?');
          values.push(condition.phone);
        }
      });
      if (orConditions.length > 0) {
        conditions.push(`(${orConditions.join(' OR ')})`);
      }
    }

    if (conditions.length === 0) return null;

    sql += conditions.join(' AND ');
    const user = db.prepare(sql).get(...values);
    return user ? { ...this.formatUser(user), password: user.password } : null;
  }

  static async comparePassword(user, candidatePassword) {
    return bcrypt.compare(candidatePassword, user.password);
  }

  static formatUser(user) {
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive === 1,
      company: user.company,
      position: user.position,
      experience: user.experience,
      profession: user.professionId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

