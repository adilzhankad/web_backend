const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  fileUrl: String,
  score: { type: Number, default: null }, // Оценка от учителя
  feedback: String // Комментарий учителя
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);