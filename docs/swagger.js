const swaggerJSDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3000;

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API",
      version: "1.0.0",
      description: "Simple LMS backend (JSON storage) for courses",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./routes/*.js"], // читаем комменты из routes
});
