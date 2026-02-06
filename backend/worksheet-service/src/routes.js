const express = require('express');
const router = express.Router();
const Subject = require('./models/Subject');

/**
 * @swagger
 * /api/worksheet/health:
 *   get:
 *     summary: Health check
 *     tags: [Worksheet]
 *     responses:
 *       200:
 *         description: Service healthy
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'worksheet-service' });
});

/**
 * @swagger
 * /api/worksheet/subjects:
 *   get:
 *     summary: List all subjects
 *     tags: [Worksheet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
 */
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find().lean();
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/worksheet/subjects:
 *   post:
 *     summary: Create a subject
 *     tags: [Worksheet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *     responses:
 *       201:
 *         description: Subject created
 */
router.post('/subjects', async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const subject = await Subject.create({ name, code: code || name.toLowerCase().replace(/\s/g, '_') });
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (code !== undefined) update.code = code;
    const subject = await Subject.findByIdAndUpdate(id, update, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
