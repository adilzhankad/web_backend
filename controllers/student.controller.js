const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');


exports.getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true }).populate('teacherId', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('courseId')
      .sort({ createdAt: -1 });

    const courses = enrollments
      .map((e) => e.courseId)
      .filter(Boolean);

    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (!enrollment) {
      return res.status(403).json({ error: 'Доступ запрещен. Вы не записаны на этот курс' });
    }

    const lessons = await Lesson.find({ courseId, isPublished: true }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (!enrollment) {
      return res.status(403).json({ error: 'Доступ запрещен. Вы не записаны на этот курс' });
    }

    const assignments = await Assignment.find({ courseId, isPublished: true }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    

    const existing = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (existing) return res.status(400).json({ error: "Вы уже записаны на этот курс" });

    const course = await Course.findById(courseId);
    if (!course || !course.published) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { text, fileUrl } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Задание не найдено' });
    }

    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId: assignment.courseId });
    if (!enrollment) {
      return res.status(403).json({ error: 'Доступ запрещен. Вы не записаны на курс этого задания' });
    }

    if (!text && !fileUrl) {
      return res.status(400).json({ error: 'Нужно отправить text или fileUrl' });
    }

    const submission = await Submission.create({
      text,
      fileUrl,
      assignmentId,
      studentId: req.user.id,
    });
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};