const express = require('express');
const router = express.Router();
const User = require('./models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * @swagger
 * /api/user/health:
 *   get:
 *     summary: Health check
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Service healthy
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, firstName, lastName, email, password]
 *             properties:
 *               userName: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 */
router.post('/register', async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;
    if (!userName || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password min 6 characters' });
    }
    const existing = await User.findOne({ $or: [{ email }, { userName }] });
    if (existing) return res.status(400).json({ success: false, message: 'User already exists' });
    const hashed = await argon2.hash(password);
    const user = await User.create({ userName, firstName, lastName, email, password: hashed });
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.userRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      accessToken: token,
      userId: user._id,
      userRole: user.userRole,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.userRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      accessToken: token,
      userId: user._id,
      userRole: user.userRole,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Profile data
 *       404:
 *         description: User not found
 */
router.get('/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { firstName, lastName, userName } = req.body;
    const update = {};
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    if (userName !== undefined) update.userName = userName;
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
