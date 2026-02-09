const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// 1. Создание курса
exports.createCourse = async (req, res) => {
  try {
    const { title, description, level } = req.body;
    const course = await Course.create({
      title,
      description: description || "",
      level: level ? level.toLowerCase() : 'beginner',
      teacherId: req.user.id 
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
    const assignment = await Assignment.create({ ...req.body, courseId: req.params.courseId });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. Оценка студента
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId, 
      { score, feedback }, 
      { new: true }
    );
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 5. Удаление курса (ИСПОРАВЛЕНО: все скобки на месте)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({ 
      _id: courseId, 
      teacherId: req.user.id 
    });

    if (!course) {
      return res.status(404).json({ error: "Курс не найден или у вас нет прав на его удаление" });
    }

    // Каскадное удаление данных
    await Lesson.deleteMany({ courseId });
    await Assignment.deleteMany({ courseId });

    res.json({ message: "Курс успешно удален" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};