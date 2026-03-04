import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Todo } from "../models/todo.model.js";

const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find();

  if (!todos.length) {
    return res.status(404).json({ message: "Todos list not found" });
  }

  res.status(200).json({
    data: todos,
    message: "Todos fetched successfully"
  });
});

const addTodo = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Todo title is empty" });
  }

  const newTodo = await Todo.create({
    title,
  });

  res.status(201).json({
    data: newTodo,
    message: "Todo added successfully"
  });
});

const updateTodo = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body;

  const todo = await Todo.findOne({
    _id: req.params.id,
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) todo.title = title;
  if (isCompleted !== undefined) todo.isCompleted = isCompleted;

  await todo.save();

  res.status(200).json({
    data: todo,
    message: "Todo updated successfully"
  });
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({
    message: "Todo deleted successfully"
  });
});

export {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};