const Course = require('../models/Course');

exports.getAll = async (req, res) => res.json(await Course.find()); // Публичный доступ [cite: 21]
exports.create = async (req, res) => res.status(201).json(await Course.create(req.body));
exports.update = async (req, res) => res.json(await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.delete = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};