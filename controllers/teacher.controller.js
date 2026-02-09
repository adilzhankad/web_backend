const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// 0. Список курсов учителя
exports.getMyCourses = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const filter = isAdmin ? {} : { teacherId: req.user.id };
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 1. Создание курса
exports.createCourse = async (req, res) => {
  try {
    const { title, description, level, published, teacherId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const resolvedTeacherId = isAdmin && teacherId ? teacherId : req.user.id;
    const course = await Course.create({
      title,
      description: description || "",
      level: level ? String(level).toLowerCase() : 'beginner',
      published: typeof published === 'boolean' ? published : true,
      teacherId: resolvedTeacherId,
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Добавление урока
exports.addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, order } = req.body;

    const course = await Course.findOne({ _id: courseId, teacherId: req.user.id });
    if (!course) return res.status(403).json({ error: "Вы не являетесь владельцем этого курса" });

    const lesson = await Lesson.create({ courseId, title, content, order });
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. Создание задания
exports.createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, maxScore, isPublished } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const course = await Course.findOne(isAdmin ? { _id: courseId } : { _id: courseId, teacherId: req.user.id });
    if (!course) {
      return res.status(403).json({ error: 'Вы не являетесь владельцем этого курса' });
    }

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      dueDate,
      maxScore,
      isPublished,
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listCourseSubmissions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const isAdmin = req.user && req.user.role === 'admin';
    const course = await Course.findOne(isAdmin ? { _id: courseId } : { _id: courseId, teacherId: req.user.id });
    if (!course) {
      return res.status(403).json({ error: 'Вы не являетесь владельцем этого курса' });
    }

    const assignments = await Assignment.find({ courseId: course._id }).select('_id');
    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({ assignmentId: { $in: assignmentIds } })
      .populate('studentId', 'email fullName')
      .populate('assignmentId', 'title courseId')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. Оценка студента
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, grade, feedback } = req.body;
    const nextScore = score !== undefined ? score : grade;
    if (nextScore === undefined) {
      return res.status(400).json({ error: 'score is required' });
    }
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId, 
      { score: nextScore, feedback }, 
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 5. Удаление курса (ИСПОРАВЛЕНО: все скобки на месте)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const isAdmin = req.user && req.user.role === 'admin';
    const deleteFilter = isAdmin
      ? { _id: courseId }
      : { _id: courseId, teacherId: req.user.id };

    const course = await Course.findOneAndDelete(deleteFilter);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден или у вас нет прав на его удаление' });
    }

    const assignments = await Assignment.find({ courseId: course._id }).select('_id');
    const assignmentIds = assignments.map((a) => a._id);

    await Lesson.deleteMany({ courseId: course._id });
    if (assignmentIds.length > 0) {
      await Submission.deleteMany({ assignmentId: { $in: assignmentIds } });
    }
    await Assignment.deleteMany({ courseId: course._id });

    res.json({ message: 'Курс успешно удален' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};