jest.mock('../../repository/user.repository');

const bcrypt = require('bcrypt');
const userRepository = require('../../repository/user.repository');
const authService = require('../../services/auth.service');

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('throws 400 when required fields are missing', async () => {
      await expect(authService.register({})).rejects.toMatchObject({
        status: 400,
        message: 'Name, email, and password are required.',
      });
    });

    it('throws 400 when password is too short', async () => {
      await expect(
        authService.register({ name: 'Test', email: 'test@example.com', password: 'short' })
      ).rejects.toMatchObject({
        status: 400,
        message: 'Password must be at least 8 characters.',
      });
    });

    it('throws 400 when email already exists', async () => {
      userRepository.findUserByEmail.mockReturnValue({ id: 1, email: 'test@example.com' });

      await expect(
        authService.register({ name: 'Test', email: 'test@example.com', password: 'password123' })
      ).rejects.toMatchObject({
        status: 400,
        message: 'An account with this email already exists.',
      });
    });

    it('creates user and returns sanitized user without password_hash', async () => {
      userRepository.findUserByEmail.mockReturnValue(null);
      userRepository.createUser.mockReturnValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed',
      });

      const user = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: expect.any(String),
        })
      );
      expect(user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(user.password_hash).toBeUndefined();

      const hash = userRepository.createUser.mock.calls[0][0].passwordHash;
      expect(await bcrypt.compare('password123', hash)).toBe(true);
    });
  });

  describe('login', () => {
    it('throws 400 when email or password is missing', async () => {
      await expect(authService.login({ email: 'test@example.com' })).rejects.toMatchObject({
        status: 400,
      });
    });

    it('throws 401 when user is not found', async () => {
      userRepository.findUserByEmail.mockReturnValue(null);

      await expect(
        authService.login({ email: 'missing@example.com', password: 'password123' })
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid email or password.',
      });
    });

    it('throws 401 when password does not match', async () => {
      const hash = await bcrypt.hash('correctpassword', 10);
      userRepository.findUserByEmail.mockReturnValue({
        id: 1,
        email: 'test@example.com',
        password_hash: hash,
      });

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrongpassword' })
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid email or password.',
      });
    });

    it('returns sanitized user on successful login', async () => {
      const hash = await bcrypt.hash('password123', 10);
      userRepository.findUserByEmail.mockReturnValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: hash,
      });

      const user = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });
});
