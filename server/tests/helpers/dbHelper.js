const db = require('../../db/db');

function clearDatabase() {
  db.exec('DELETE FROM assignments');
  db.exec('DELETE FROM users');
}

module.exports = { clearDatabase };
