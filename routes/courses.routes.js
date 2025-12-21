const express = require("express");
const router = express.Router();

const { loadStorage, saveStorage, nextId } = require("../utils/storage");

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  return id;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         title: { type: string, example: "Intro to JavaScript" }
 *         description: { type: string, example: "Basics of JS and DOM" }
 *         level: { type: string, example: "beginner" }
 *         published: { type: boolean, example: false }
 *         created_at: { type: string, example: "2025-12-18T00:00:00.000Z" }
 *         updated_at: { type: string, example: "2025-12-18T01:00:00.000Z" }
 */

/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get("/courses", (req, res) => {
  const db = loadStorage();
  res.json(db.courses);
});

/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     summary: Get course by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Course }
 *       404: { description: Not found }
 */
router.get("/courses/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const db = loadStorage();
  const course = db.courses.find((c) => c.id === id);

  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

/**
 * @openapi
 * /courses:
 *   post:
 *     summary: Create new course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               level: { type: string }
 *               published: { type: boolean }
 *     responses:
 *       201: { description: Created }
 */
router.post("/courses", (req, res) => {
  const { title, description, level, published } = req.body || {};

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Field 'title' is required" });
  }

  const db = loadStorage();

  const newCourse = {
    id: nextId(db.courses),
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    level: typeof level === "string" && level.trim() ? level.trim() : "beginner",
    published: typeof published === "boolean" ? published : false,
    created_at: new Date().toISOString(),
  };

  db.courses.push(newCourse);
  saveStorage(db);

  res.status(201).json(newCourse);
});

/**
 * @openapi
 * /courses/{id}:
 *   put:
 *     summary: Update course
 */
router.put("/courses/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const db = loadStorage();
  const course = db.courses.find((c) => c.id === id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const { title, description, level, published } = req.body || {};

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "Field 'title' must be a non-empty string" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "Field 'description' must be a string" });
  }
  if (level !== undefined && typeof level !== "string") {
    return res.status(400).json({ error: "Field 'level' must be a string" });
  }
  if (published !== undefined && typeof published !== "boolean") {
    return res.status(400).json({ error: "Field 'published' must be a boolean" });
  }

  if (title !== undefined) course.title = title.trim();
  if (description !== undefined) course.description = description.trim();
  if (level !== undefined) course.level = level.trim();
  if (published !== undefined) course.published = published;

  course.updated_at = new Date().toISOString();

  saveStorage(db);
  res.json(course);
});

/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     summary: Delete course
 */
router.delete("/courses/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const db = loadStorage();
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Course not found" });

  db.courses.splice(idx, 1);
  saveStorage(db);

  res.json({ success: true });
});

module.exports = router;
