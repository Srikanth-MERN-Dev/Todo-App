const express = require('express');
const { body } = require('express-validator');
const { getTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTodos)
  .post([
    body('title').trim().notEmpty().withMessage('Title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  ], createTodo);

router.route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;
