import express from "express";
import mongoose from "mongoose";
import todoModel from "../models/todo.js";
import isBodyValid from "../util/isBodyValid.js";

const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
  const todos = await todoModel.find({ isRoot: true });
  if (todos.length === 0) {
    res.status(404).send({ massage: `there is no todos in DB` });
  } else {
    for (const todo of todos) {
      await todoModel.populateAll(todo);
    }
    res.status(200).send({ todos: todos });
  }
  res.end();
});

todoRouter.get("/:id", async (req, res) => {
  let id;
  try {
    id = mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    res.status(404).send({ massage: `invalid id: ${id}` });
    res.end();
    return;
  }
  const todo = await todoModel.findOne({ _id: req.params.id });
  if (todo) {
    await todoModel.populateAll(todo);
    res.status(200).send({ todo: todo });
  } else {
    res
      .status(404)
      .send({ massage: `there is no todo with id ${req.params.id} in DB` });
  }
  res.end();
});

todoRouter.post("/", async (req, res) => {
  if (isBodyValid(req.body)) {
    const todo = await todoModel.saveTodo({ ...req.body, isRoot: true });
    await todoModel.populateAll(todo);
    res.status(200).send(todo);
  } else {
    res.status(404).send({ massage: "invalid todo" });
  }
  res.end();
});

todoRouter.put("/:id", async (req, res) => {
  let id;
  try {
    id = mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    res.status(404).send({ massage: `invalid id: ${req.params.id}` });
    res.end();
    return;
  }
  if (isBodyValid(req.body)) {
    const toSave = { ...req.body, _id: req.params.id };
    const todo = await todoModel.updateTodo(toSave);
    await todoModel.populateAll(todo);
    res.status(200).send(todo);
  }
  else{
    res.status(404).send({ massage: "invalid todo" });
  }
  res.end();
});

todoRouter.patch("/:id", async (req, res) => {
  let id;
  try {
    id = mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    res.status(404).send({ massage: `invalid id: ${req.params.id}` });
    res.end();
    return;
  }
  if( (await todoModel.find({_id:id})).length === 0 ){
    res.status(404).send({ massage: `not exiting id: ${req.params.id}` });
    res.end();
    return;
  }
  if (isBodyValid(req.body)) {
    const toSave = { ...req.body, _id: req.params.id };
    const todo = await todoModel.updateTodo(toSave);
    await todoModel.populateAll(todo);
    res.status(200).send(todo);
  }
  else{
    res.status(400).send({ massage: "invalid todo" });
  }
  res.end();
});

todoRouter.delete("/:id", async (req, res) => {
  const todo = await todoModel.findOne({ _id: req.params.id });
  if (todo) {
    await todoModel.populateAll(todo);
    await todoModel.deleteTodo(todo);
    res.status(200).send({ massage: "todo deleted" });
  } else {
    res.status(400).send({ massage: "invalid todo" });
  }
  res.end();
});

export default todoRouter;
