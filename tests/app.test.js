import supertest from "supertest";
import todoModel from "../models.todo.js";
import testData from "./testData.json";
import { testables } from "../app.js";

const { app } = testables;
const request = supertest(app);

test("Should failed when env not test ", () => {
  expect(process.env.NODE_ENV).toEqual("test");
});

describe("GET /", () => {
  it("response with 404", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(404);
  });
});

describe("GET /todo", () => {
  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("return massage is there is no todos in DB", async () => {
    const response = await request.get("/todo");
    expect(response.status).toBe(404);
  });

  it("Gets all todos with root = true", async () => {
    const todo = testData.todoList;
    await todoModel.saveTodo(todo);
    todo.isRoot = true;
    await todoModel.saveTodo(todo);
    const response = await request.get("/todo");
    expect(response.status).toBe(200);
    expect(response.body.todos.length).tobe(1);
    expect(response.body.todos[0].isRoot).tobe(true);
  });

  it("The todos that recived are populated", async () => {
    const todo = testData.todoList;
    todo.isRoot = true;
    await todoModel.saveTodo(todo);
    expect(
      response.body.todos[0].subTodos[0].description ==
        todo.subTodos[0].description ||
        response.body.todos[0].subTodos[0].description ==
          todo.subTodos[1].description
    ).toEqual(true);
  });
});

describe("GET /todo/:id", () => {
  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("get 404 request when nonexiting id", async () => {
    const id = "123123";
    const response = await request.get(`/todo${id}`);
    expect(response.status).toBe(404);
  });

  it("recived the requested id", async () => {
    const todo = testData.todoList;
    await todoModel.saveTodo(todo);
    const { _id } = await todoModel.saveTodo(todo);
    const response = await request.get(`/todo${id}`);
    expect(response.status).toBe(200);
    expect(response.body.todo.description).toEqual(todo.description);
  });

  it("The todo that recived is populated", async () => {
    const todo = testData.todoList;
    todo.isRoot = true;
    await todoModel.saveTodo(todo);
    expect(
      response.body.todo.subTodos[0].description ==
        todo.subTodos[0].description ||
        response.body.todo.subTodos[0].description ==
          todo.subTodos[1].description
    ).toEqual(true);
  });
});
