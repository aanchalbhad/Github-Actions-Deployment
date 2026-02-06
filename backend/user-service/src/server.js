require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3001;

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL || 'mongodb://mongodb:27017/fractal');
};

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'User Service API', version: '1.0.0' },
  },
  apis: [path.join(__dirname, './routes.js')],
});

app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: true, credentials: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'user-service', timestamp: new Date().toISOString() });
});

app.get('/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/user', routes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal server error' });
});

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`User service on ${port}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
