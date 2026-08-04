const db = require('../db/db');

function createAssignment(userId, { title, course_name, due_date, priority }) {
  const stmt = db.prepare(
    `INSERT INTO assignments (user_id, title, course_name, due_date, priority) VALUES (?, ?, ?, ?, ?)`
  );
  const result = stmt.run(userId, title, course_name, due_date, priority);
  return findAssignmentById(result.lastInsertRowid);
}

function findAssignmentById(id) {
  const stmt = db.prepare(`SELECT * FROM assignments WHERE id = ?`);
  return stmt.get(id);
}

function findAssignmentsByUser(userId, filters = {}) {
  let query = `SELECT * FROM assignments WHERE user_id = ?`;
  const params = [userId];

  if (filters.course) {
    query += ` AND course_name = ?`;
    params.push(filters.course);
  }
  if (filters.priority) {
    query += ` AND priority = ?`;
    params.push(filters.priority);
  }
  if (filters.status) {
    query += ` AND status = ?`;
    params.push(filters.status);
  }
  if (filters.from) {
    query += ` AND due_date >= ?`;
    params.push(filters.from);
  }
  if (filters.to) {
    query += ` AND due_date <= ?`;
    params.push(filters.to);
  }

  query += filters.sort === 'priority' ? ` ORDER BY priority ASC` : ` ORDER BY due_date ASC`;

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

function updateAssignment(id, fields) {
  const current = findAssignmentById(id);
  if (!current) return null;

  const updated = { ...current, ...fields };
  const stmt = db.prepare(
    `UPDATE assignments SET title = ?, course_name = ?, due_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  );
  stmt.run(updated.title, updated.course_name, updated.due_date, updated.priority, id);
  return findAssignmentById(id);
}

function updateStatus(id, status) {
  const completedAt = status === 'Complete' ? new Date().toISOString() : null;
  const stmt = db.prepare(
    `UPDATE assignments SET status = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  );
  stmt.run(status, completedAt, id);
  return findAssignmentById(id);
}

function deleteAssignment(id) {
  const stmt = db.prepare(`DELETE FROM assignments WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = {
  createAssignment,
  findAssignmentById,
  findAssignmentsByUser,
  updateAssignment,
  updateStatus,
  deleteAssignment,
};