import { getSQLiteDB } from '../../config/sqlite-database.js';

export class TechnologySQLite {
  static create(technologyData) {
    const db = getSQLiteDB();
    const { name, category, description, isActive } = technologyData;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const stmt = db.prepare(`
      INSERT INTO technologies (name, slug, category, description, isActive)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      slug,
      category || 'other',
      description || null,
      isActive !== undefined ? (isActive ? 1 : 0) : 1
    );
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const db = getSQLiteDB();
    const technology = db.prepare('SELECT * FROM technologies WHERE id = ?').get(id);
    return technology ? this.formatTechnology(technology) : null;
  }

  static find(query = {}) {
    const db = getSQLiteDB();
    let sql = 'SELECT * FROM technologies WHERE 1=1';
    const values = [];

    if (query.isActive !== undefined) {
      sql += ' AND isActive = ?';
      values.push(query.isActive === 'true' || query.isActive === true ? 1 : 0);
    }
    if (query.category) {
      sql += ' AND category = ?';
      values.push(query.category);
    }

    sql += ' ORDER BY name';
    const technologies = db.prepare(sql).all(...values);
    return technologies.map(t => this.formatTechnology(t));
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
    if (updateData.category !== undefined) {
      updates.push('category = ?');
      values.push(updateData.category);
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

    const sql = `UPDATE technologies SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);
    return this.findById(id);
  }

  static findByIdAndDelete(id) {
    const db = getSQLiteDB();
    const technology = this.findById(id);
    if (technology) {
      db.prepare('DELETE FROM technologies WHERE id = ?').run(id);
    }
    return technology;
  }

  static formatTechnology(technology) {
    if (!technology) return null;
    return {
      _id: technology.id,
      id: technology.id,
      name: technology.name,
      slug: technology.slug,
      category: technology.category,
      description: technology.description,
      isActive: technology.isActive === 1,
      createdAt: technology.createdAt,
      updatedAt: technology.updatedAt,
    };
  }
}

