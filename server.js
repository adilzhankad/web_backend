const express = require("express");
const swaggerUi = require("swagger-ui-express");

const demoRoutes = require("./routes/demo.routes");
const coursesRoutes = require("./routes/courses.routes");
const swaggerSpec = require("./docs/swagger");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// routes
app.use("/", demoRoutes);
app.use("/", coursesRoutes);

// docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Docs available at http://localhost:${PORT}/docs`);
});
