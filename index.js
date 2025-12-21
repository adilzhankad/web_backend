const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Swagger config ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API',
      version: '1.0.0',
      description: 'docs',
    },
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Главная страница
 *     responses:
 *       200:
 *         description: Успешный ответ
 */
app.get('/', (req, res) => {
  res.send('Привет, Express + Swagger!');
});

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Пример маршрута
 *     responses:
 *       200:
 *         description: Возвращает приветствие
 */
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Express API' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Документация: http://localhost:${PORT}/docs`);
});
