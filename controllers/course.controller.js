const Course = require('../models/Course');

exports.getAll = async (req, res) => res.json(await Course.find()); // Публичный доступ [cite: 21]
exports.create = async (req, res) => {
  try {
    const { title, description, level, published, teacherId } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!teacherId) {
      return res.status(400).json({ error: 'teacherId is required' });
    }

    const course = await Course.create({
      title,
      description,
      level,
      published,
      teacherId,
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.update = async (req, res) => res.json(await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.delete = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};