import express from "express";
import todoModel from "../models/todo.js";

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
  try {
    const todo = await todoModel.findOne({ _id: req.params.id });
    if (todo) {
      await todoModel.populateAll(todo);
      res.status(200).send({ todo: todo });
    } else {
      throw new Error("id not found");
    }
  } catch (e) {
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
  res.end();
});

todoRouter.patch("/:id", async (req, res) => {
  res.end();
});

todoRouter.delete("/:id", async (req, res) => {
  res.end();
});

export default todoRouter;
