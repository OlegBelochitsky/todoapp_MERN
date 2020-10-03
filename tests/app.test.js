import supertest from "supertest";
import mongoose from "mongoose";
import todoModel from "../models/todo.js";
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

describe("POST /", () => {
  it("responds with 404", (done) => {
    request
      .post("/")
      .send({ name: "john" })
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /todo", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

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
    expect(response.body.todos.length).toBe(1);
    expect(response.body.todos[0].isRoot).toBe(true);
  });

  it("The todos that recived are populated", async () => {
    const todo = testData.todoList;
    todo.isRoot = true;
    await todoModel.saveTodo(todo);
    const response = await request.get(`/todo`);
    expect(
      response.body.todos[0].subTodos[0].description ==
        todo.subTodos[0].description ||
        response.body.todos[0].subTodos[0].description ==
          todo.subTodos[1].description
    ).toEqual(true);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe("GET /todo/:id", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("get 404 request when nonexiting id", async () => {
    const todo = testData.todoList;
    const { _id } = await todoModel.saveTodo(todo);
    const id = "123123";
    const response = await request.get(`/todo/${id}`);
    expect(response.status).toBe(404);

    const id2 = (_id[0] == "a" ? "a" : "b") + ("" + _id).slice(1);
    const response2 = await request.get(`/todo/${id2}`);
    expect(response2.status).toBe(404);
  });

  it("recived the requested id", async () => {
    const todo = testData.todoList;
    const { _id } = await todoModel.saveTodo(todo);
    const response = await request.get(`/todo/${_id}`);
    expect(response.status).toBe(200);
    expect(response.body.todo.description).toEqual(todo.description);
  });

  it("The todo that recived is populated", async () => {
    const todo = testData.todoList;
    todo.isRoot = true;
    const { _id } = await todoModel.saveTodo(todo);
    const response = await request.get(`/todo/${_id}`);
    expect(
      response.body.todo.subTodos[0].description ==
        todo.subTodos[0].description ||
        response.body.todo.subTodos[0].description ==
          todo.subTodos[1].description
    ).toEqual(true);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe("POST /todo", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("respond status 400 when todo is bad with massage", async () => {
    const badTodo = { notTodo: "not a todo" };
    const res = await request.post("/todo").set("Accept", /json/).send(badTodo);
    expect(res.status).toEqual(404);
    expect(res.body.massage).toEqual("invalid todo");
  });

  it("can save valid todo to db", async () => {
    const validTodo = testData.todoList;
    await request.post("/todo").set("Accept", /json/).send(validTodo);
    const fromDb = await todoModel.findOne({
      description: validTodo.description,
    });
    expect(fromDb.description).toEqual(validTodo.description);
  });

  it("after sucsestful save respond is status 200 with papulated todo", async () => {
    const validTodo = testData.todoList;
    const response = await request
      .post("/todo")
      .set("Accept", /json/)
      .send(validTodo);
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(
      response.body.subTodos[0].description ==
        validTodo.subTodos[0].description ||
        response.body.subTodos[0].description ==
          validTodo.subTodos[1].description
    ).toEqual(true);
  });

  it("saved todo saved with isRoot=true", async () => {
    const validTodo = testData.todoList;
    const res = await request
      .post("/todo")
      .set("Accept", /json/)
      .send(validTodo);
    expect(res.body.isRoot).toBe(true);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
