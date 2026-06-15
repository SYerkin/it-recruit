import { getSQLiteDB } from '../../config/sqlite-database.js';

export class ProfessionSQLite {
  static create(professionData) {
    const db = getSQLiteDB();
    const { name, description, isActive } = professionData;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const stmt = db.prepare(`
      INSERT INTO professions (name, slug, description, isActive)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, slug, description || null, isActive !== undefined ? (isActive ? 1 : 0) : 1);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const db = getSQLiteDB();
    const profession = db.prepare('SELECT * FROM professions WHERE id = ?').get(id);
    return profession ? this.formatProfession(profession) : null;
  }

  static find(query = {}) {
    const db = getSQLiteDB();
    let sql = 'SELECT * FROM professions WHERE 1=1';
    const values = [];

    if (query.isActive !== undefined) {
      sql += ' AND isActive = ?';
      values.push(query.isActive === 'true' || query.isActive === true ? 1 : 0);
    }

    sql += ' ORDER BY name';
    const professions = db.prepare(sql).all(...values);
    return professions.map(p => this.formatProfession(p));
  }

  static findByIdAndUpdate(id, updateData) {
    const db = getSQLiteDB();
    const updates = [];
    const values = [];

    if (updateData.name !== undefined) {
      updates.push('name = ?');
      values.push(updateData.name);
      if (!updateData.slug) {
        updates.push('slug = ?');
        values.push(updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      }
    }
    if (updateData.slug !== undefined) {
      updates.push('slug = ?');
      values.push(updateData.slug);
    }
    if (updateData.description !== undefined) {
      updates.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.isActive !== undefined) {
      updates.push('isActive = ?');
      values.push(updateData.isActive ? 1 : 0);
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    if (updates.length === 0) {
      return this.findById(id);
    }

    const sql = `UPDATE professions SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);
    return this.findById(id);
  }

  static findByIdAndDelete(id) {
    const db = getSQLiteDB();
    const profession = this.findById(id);
    if (profession) {
      db.prepare('DELETE FROM professions WHERE id = ?').run(id);
    }
    return profession;
  }

  static formatProfession(profession) {
    if (!profession) return null;
    return {
      _id: profession.id,
      id: profession.id,
      name: profession.name,
      slug: profession.slug,
      description: profession.description,
      isActive: profession.isActive === 1,
      createdAt: profession.createdAt,
      updatedAt: profession.updatedAt,
    };
  }
}

