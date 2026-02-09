const express = require('express');
const router = express.Router();
const teacherCtrl = require('../controllers/teacher.controller');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/**
 * @swagger
 * tags:
 * - name: Teacher
 * description: Teacher endpoints
 */
// Применяем middleware авторизации и проверки ролей ко всем роутам ниже
// Важно: твой requireRole должен поддерживать массивы!
router.use(auth, requireRole(['teacher', 'admin']));

/**
 * @swagger
 * /api/teacher/courses:
 *   get:
 *     summary: List teacher courses (teacher/admin)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 */
router.get('/courses', teacherCtrl.getMyCourses);

/**
 * @swagger
 * /api/teacher/courses:
 * post:
 * summary: Create course (teacher/admin)
 * tags: [Teacher]
 */
router.post('/courses', teacherCtrl.createCourse);

/**
 * @swagger
 * /api/teacher/courses/{courseId}:
 * delete:
 * summary: Delete course (teacher/admin)
 * tags: [Teacher]
 * parameters:
 * - in: path
 * name: courseId
 * required: true
 * schema:
 * type: string
 */
// НОВЫЙ РОУТ ДЛЯ УДАЛЕНИЯ
router.delete('/courses/:courseId', teacherCtrl.deleteCourse);

/**
 * @swagger
 * /api/teacher/courses/{courseId}/lessons:
 * post:
 * summary: Add lesson to course (teacher/admin)
 * tags: [Teacher]
 */
router.post('/courses/:courseId/lessons', teacherCtrl.addLesson);

/**
 * @swagger
 * /api/teacher/courses/{courseId}/assignments:
 * post:
 * summary: Create assignment (teacher/admin)
 * tags: [Teacher]
 */
router.post('/courses/:courseId/assignments', teacherCtrl.createAssignment);

/**
 * @swagger
 * /api/teacher/courses/{courseId}/submissions:
 *   get:
 *     summary: List submissions for a course (teacher/admin)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/courses/:courseId/submissions', teacherCtrl.listCourseSubmissions);

/**
 * @swagger
 * /api/teacher/submissions/{submissionId}/grade:
 * put:
 * summary: Grade submission (teacher/admin)
 * tags: [Teacher]
 */
router.put('/submissions/:submissionId/grade', teacherCtrl.gradeSubmission);

module.exports = router;