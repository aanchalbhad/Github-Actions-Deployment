const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/notification/health:
 *   get:
 *     summary: Health check
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Service healthy
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

/**
 * @swagger
 * /api/notification/send:
 *   post:
 *     summary: Send notification (mock)
 *     tags: [Notification]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to: { type: string, description: Recipient email }
 *               subject: { type: string }
 *               body: { type: string }
 *     responses:
 *       200:
 *         description: Notification sent (mock)
 */
router.post('/send', (req, res) => {
  res.json({
    success: true,
    message: 'Notification queued (mock)',
    id: `notif_${Date.now()}`,
  });
});

/**
 * @swagger
 * /api/notification/status:
 *   get:
 *     summary: Get notification status
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Status info
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: { mode: 'mock', queueSize: 0 },
  });
});

module.exports = router;
