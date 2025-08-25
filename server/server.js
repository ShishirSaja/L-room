require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const fileRoutes = require('./routes/files');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database synced successfully.");
}).catch(err => {
  console.error("Failed to sync database: " + err.message);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Learning Room API." });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});