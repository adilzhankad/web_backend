const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/student.controller');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student endpoints
 */

router.use(auth);

/**
 * @swagger
 * /api/student/courses:
 *   get:
 *     summary: Get available courses (student)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 */
router.get('/courses', studentCtrl.getAvailableCourses);

/**
 * @swagger
 * /api/student/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course (student)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/courses/:courseId/enroll', requireRole('student'), studentCtrl.enrollInCourse);

/**
 * @swagger
 * /api/student/assignments/{assignmentId}/submissions:
 *   post:
 *     summary: Submit assignment (student)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 */
router.post(
  '/assignments/:assignmentId/submissions',
  requireRole('student'),
  studentCtrl.submitAssignment
);

module.exports = router;
