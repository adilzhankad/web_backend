const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/", courseRoutes);
const adminRoutes = require("./routes/admin.routes");
app.use("/", adminRoutes);


app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
