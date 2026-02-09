const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/course.controller');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Courses endpoints
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses (public)
 *     tags: [Courses]
 */
router.get('/', courseCtrl.getAll);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create course (admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, requireRole('admin'), courseCtrl.create);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course (admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', auth, requireRole('admin'), courseCtrl.update);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course (admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', auth, requireRole('admin'), courseCtrl.delete);

module.exports = router;
