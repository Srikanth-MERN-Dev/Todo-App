const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');

const getTodos = async (req, res, next) => {
  try {
    const { status, search, priority } = req.query;
    let query = { createdBy: req.user._id };

    if (status === 'completed') query.completed = true;
    else if (status === 'pending') query.completed = false;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 });

    const stats = {
      total: await Todo.countDocuments({ createdBy: req.user._id }),
      completed: await Todo.countDocuments({ createdBy: req.user._id, completed: true }),
      pending: await Todo.countDocuments({ createdBy: req.user._id, completed: false }),
      highPriority: await Todo.countDocuments({ createdBy: req.user._id, priority: 'high', completed: false }),
    };

    res.json({ todos, stats });
  } catch (error) {
    next(error);
  }
};

const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array().map((e) => e.msg).join(', '),
      });
    }

    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    const updated = await todo.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodos, getTodo, createTodo, updateTodo, deleteTodo };
