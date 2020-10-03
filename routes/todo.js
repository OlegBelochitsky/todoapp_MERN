import express from "express";
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
  if (isBodyValid(req.body)) {
    const todo = await todoModel.updateTodo(req.body);
    await todoModel.populateAll(todo);
    res.status(200).send(todo);
  } else {
    res.status(404).send({ massage: "invalid todo" });
  }
  res.end();
});

todoRouter.patch("/:id", async (req, res) => {
  if (isBodyValid(req.body)) {
    try {
      const { _id } = req.body;
      const inDb = await todoModel.findOne(_id);
      if (!inDb) {
        throw new Error(`not found todo with id:${_id}`);
      } else {
        const todo = await todoModel.updateTodo(req.body);
        await todoModel.populateAll(todo);
        res.status(200).send(todo);
      }
    } catch (e) {
      res.status(404).send({ massage: e.massage });
    }
  } else {
    res.status(404).send({ massage: "invalid todo" });
  }
  res.end();
});

todoRouter.delete("/:id", async (req, res) => {
  if (isBodyValid(req.body)) {
    await todoModel.deleteTodo(req.body);
    res.status(200).send({ massage: "todo deleted" });
  } else {
    res.status(404).send({ massage: "invalid todo" });
  }
  res.end();
});

export default todoRouter;
