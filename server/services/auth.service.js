const bcrypt = require('bcrypt');
const userRepository = require('../repository/user.repository');

const SALT_ROUNDS = 10;

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw { status: 400, message: 'Name, email, and password are required.' };
  }
  if (password.length < 8) {
    throw { status: 400, message: 'Password must be at least 8 characters.' };
  }

  const existing = userRepository.findUserByEmail(email);
  if (existing) {
    throw { status: 400, message: 'An account with this email already exists.' };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = userRepository.createUser({ name, email, passwordHash });
  return sanitizeUser(user);
}

async function login({ email, password }) {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required.' };
  }

  const user = userRepository.findUserByEmail(email);
  if (!user) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  return sanitizeUser(user);
}

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

module.exports = { register, login, sanitizeUser };