require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Импорт маршрутов
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const adminRoutes = require('./routes/admin.routes');
const teacherRoutes = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// База данных 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Swagger Documentation 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Подключение маршрутов (Роутинг) [cite: 16]
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Корневой роут для проверки сервера
app.get('/', (req, res) => {
  res.send('LMS API is running. Go to /api-docs for documentation.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Documentation available at http://localhost:${PORT}/api-docs`);
});


