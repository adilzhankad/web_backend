// docs/swagger.js
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API',
      version: '1.0.0',
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