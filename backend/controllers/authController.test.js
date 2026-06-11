process.env.DATABASE_URL = 'postgres://dummy:dummy@dummy:5432/dummy';
process.env.JWT_SECRET = 'dummy_secret';

const { register, login } = require('./authController');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('authController White Box Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock Express req and res objects
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register()', () => {
    test('Path 1: Missing fields', async () => {
      req.body = { name: 'Test' }; // missing email & password
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please fill all fields." });
    });

    test('Path 2: Email already exists', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: 'pass', role: 'student' };
      UserModel.findByEmail.mockResolvedValueOnce({ id: 1 }); // User exists

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already registered." });
    });

    test('Path 3: Successful Registration', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: 'pass', role: 'teacher' };
      UserModel.findByEmail.mockResolvedValueOnce(null); // User does not exist
      bcrypt.hash.mockResolvedValueOnce('hashed_pass');
      UserModel.create.mockResolvedValueOnce({ id: 1, name: 'Test' });

      await register(req, res);
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(UserModel.create).toHaveBeenCalledWith('Test', 'test@test.com', 'hashed_pass', 'teacher');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Registration successful!" }));
    });

    test('Path 4: Database Error', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: 'pass' };
      UserModel.findByEmail.mockRejectedValueOnce(new Error('DB crash')); // Error thrown

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error during registration." });
    });
  });

  describe('login()', () => {
    test('Path 1: Missing fields', async () => {
      req.body = { email: 'test@test.com' }; // missing password
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please fill all fields." });
    });

    test('Path 2: User not found', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      UserModel.findByEmail.mockResolvedValueOnce(null); // User does not exist

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password." });
    });

    test('Path 3: Incorrect password', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' };
      UserModel.findByEmail.mockResolvedValueOnce({ id: 1, password: 'hashed_pass' });
      bcrypt.compare.mockResolvedValueOnce(false); // passwords don't match

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password." });
    });

    test('Path 4: Successful Login', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      const fakeUser = { id: 1, name: 'Test', role: 'student', password: 'hashed_pass', email: 'test@test.com' };
      
      UserModel.findByEmail.mockResolvedValueOnce(fakeUser);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('fake-jwt-token');

      await login(req, res);
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Login successful!",
        token: 'fake-jwt-token'
      }));
    });

    test('Path 5: Server Error', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      UserModel.findByEmail.mockRejectedValueOnce(new Error('DB crash')); // Error thrown

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error during login." });
    });
  });
});
