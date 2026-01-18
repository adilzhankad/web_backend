const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const PORT = process.env.PORT || 3000;

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API",
      version: "1.0.0",
      description: "Simple LMS backend (MongoDB) for courses",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
});
