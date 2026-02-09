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
 * /api/student/my-courses:
 *   get:
 *     summary: Get enrolled courses (student)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-courses', requireRole('student'), studentCtrl.getMyCourses);

/**
 * @swagger
 * /api/student/courses/{courseId}/lessons:
 *   get:
 *     summary: Get published lessons for an enrolled course (student)
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
router.get('/courses/:courseId/lessons', requireRole('student'), studentCtrl.getCourseLessons);

/**
 * @swagger
 * /api/student/courses/{courseId}/assignments:
 *   get:
 *     summary: Get published assignments for an enrolled course (student)
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
router.get('/courses/:courseId/assignments', requireRole('student'), studentCtrl.getCourseAssignments);

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
