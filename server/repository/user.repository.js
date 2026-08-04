const db = require('../db/db');

function createUser({ name, email, passwordHash }) {
  const stmt = db.prepare(
    `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`
  );
  const result = stmt.run(name, email, passwordHash);
  return findUserById(result.lastInsertRowid);
}

function findUserByEmail(email) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email);
}

function findUserById(id) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id);
}

function updateUser(id, { name, email, timezone, theme }) {
  const stmt = db.prepare(
    `UPDATE users SET name = ?, email = ?, timezone = ?, theme = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  );
  stmt.run(name, email, timezone, theme, id);
  return findUserById(id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};