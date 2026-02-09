const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');


exports.getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true }).populate('teacherId', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    

    const existing = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (existing) return res.status(400).json({ error: "Вы уже записаны на этот курс" });

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Submission = require('../models/Submission');

exports.submitAssignment = async (req, res) => {
  try {
    const submission = await Submission.create({
      ...req.body,
      assignmentId: req.params.assignmentId,
      studentId: req.user.id
    });
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};