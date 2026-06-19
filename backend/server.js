const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { errorHandler, notFound } = require('./utils/errorHandler');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin:"https://todo-app-frontend-l7zb.onrender.com",
  credentials:true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Todo API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
