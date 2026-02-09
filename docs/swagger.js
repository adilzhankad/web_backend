// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Убедитесь, что здесь теги тоже оформлены правильно, если они есть
    tags: [
      {
        name: 'Teacher',
        description: 'Teacher endpoints',
      },
      {
        name: 'Courses',
        description: 'Courses endpoints',
      },
    ],
  },
  apis: ['./routes/*.js'], // пути к файлам с роутами
};

module.exports = swaggerJSDoc(swaggerOptions);