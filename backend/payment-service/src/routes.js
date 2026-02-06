const express = require('express');
const router = express.Router();

const MOCK_PACKAGES = [
  { id: 'pkg_1', name: 'Basic Plan', price: 99, currency: 'AUD' },
  { id: 'pkg_2', name: 'Premium Plan', price: 199, currency: 'AUD' },
  { id: 'pkg_3', name: 'Enterprise Plan', price: 399, currency: 'AUD' },
];

/**
 * @swagger
 * /api/payment/health:
 *   get:
 *     summary: Health check
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Service healthy
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

/**
 * @swagger
 * /api/payment/packages/list:
 *   post:
 *     summary: List available packages
 *     tags: [Payment]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: List of packages
 */
router.post('/packages/list', (req, res) => {
  res.json({ success: true, data: MOCK_PACKAGES });
});

/**
 * @swagger
 * /api/payment/status:
 *   get:
 *     summary: Get payment status
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: { status: 'active', lastPayment: null, plan: 'trial' },
  });
});

module.exports = router;
