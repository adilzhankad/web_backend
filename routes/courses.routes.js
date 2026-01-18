const express = require("express");
const mongoose = require("mongoose");
const Course = require("../models/Course");

const router = express.Router();

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Courses CRUD
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, level]
 *             properties:
 *               title: { type: string, example: "Intro to JS" }
 *               description: { type: string, example: "Basics of JavaScript" }
 *               level: { type: string, example: "beginner" }
 *               published: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const { title, description, level, published } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Field 'title' is required" });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ error: "Field 'description' is required" });
    }
    if (!level || typeof level !== "string" || !level.trim()) {
      return res.status(400).json({ error: "Field 'level' is required" });
    }
    if (published !== undefined && typeof published !== "boolean") {
      return res.status(400).json({ error: "Field 'published' must be a boolean" });
    }

    const created = await Course.create({
      title: title.trim(),
      description: description.trim(),
      level: level.trim(),
      published: published ?? false,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get one course by MongoDB id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course found
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a course by MongoDB id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               level: { type: string }
 *               published: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Invalid id / validation error
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a course by MongoDB id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid MongoDB id" });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.put("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid MongoDB id" });
    }

    const { title, description, level, published } = req.body || {};

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({ error: "Field 'title' must be a non-empty string" });
    }
    if (description !== undefined && (typeof description !== "string" || !description.trim())) {
      return res.status(400).json({ error: "Field 'description' must be a non-empty string" });
    }
    if (level !== undefined && (typeof level !== "string" || !level.trim())) {
      return res.status(400).json({ error: "Field 'level' must be a non-empty string" });
    }
    if (published !== undefined && typeof published !== "boolean") {
      return res.status(400).json({ error: "Field 'published' must be a boolean" });
    }

    const update = {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(level !== undefined ? { level: level.trim() } : {}),
      ...(published !== undefined ? { published } : {}),
    };

    const updated = await Course.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Course not found" });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid MongoDB id" });
    }

    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Course not found" });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
