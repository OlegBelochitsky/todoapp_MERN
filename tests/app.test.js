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

describe("PUT /todo/:id", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("update exiting todo", async () => {
    const todo= await todoModel.papulateAll( await todoModel.saveTodo(testData.todoList));
    todo.description = "new description";
    const res = await request.put(`/todo/${todo._id}`).set("Accept", /json/).send(todo);
    expect(res.body.description).toEqual("new description");
  });

  it("adding new todo (as root) if not already exiting", async () => {
    const res = await request.put(`/todo/123123`).set("Accept", /json/).send(testData.todoList);
    expect(res.body.description).toEqual(testData.todoList.description);
    expect(res.body.isRoot).toBe(true);
  });

  it("retruning papulated todo", async () => {
    const res = await request.put("/todo/123123").set("Accept", /json/).send(testData.todoList);
    expect(res.body.subTodos[0]).toBeDefined();
    expect(res.body.subTodos[1]).toBeDefined();
  });

  it("return error if bad todo", async () => {
    const badTodo = { notTodo: "not a todo" };
    const res = await request.put("/todo/123123").set("Accept", /json/).send(badTodo);
    expect(res.status).toEqual(404);
    expect(res.body.massage).toEqual("invalid todo");
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe("PATCH /todo/:id", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("update exiting todo", async () => {
    const todo= await todoModel.papulateAll( await todoModel.saveTodo(testData.todoList));
    todo.description = "new description";
    const res = await request.patch(`/todo/${todo._id}`).set("Accept", /json/).send(todo);
    expect(res.body.description).toEqual("new description");
  });

  it("return error if bad todo", async () => {
    const badTodo = { notTodo: "not a todo" };
    const res = await request.patch(`/todo/123123123`).set("Accept", /json/).send(badTodo);
    expect(res.status).toEqual(404);
    expect(res.body.massage).toEqual("invalid todo");
  });

  it("return error if not already exiting", async () => {
    const res = await request.patch(`/todo/123123123`).set("Accept", /json/).send(testData.singleTodo);
    expect(res.status).toEqual(404);
    expect(res.body.massage).toEqual("nonexiting todo");
  });

  it("retruning papulated todo", async () => {
    const todo= await todoModel.papulateAll( await todoModel.saveTodo(testData.todoList));
    const res = await request.patch(`/todo/${todo._id}`).set("Accept", /json/).send(todo);
    expect(res.body.subTodos[0]).toBeDefined();
    expect(res.body.subTodos[1]).toBeDefined();
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe("DELETE /todo/:id", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("return error if not exiting", async () => {
    const badId = 'notReadyAnId';
    const res = await request.delete(`/todo/${badId}`);
    expect(res.status).toBe(400);
    expect(res.body.massage).toEqual("invalid todo");
  });

  it("sucsess massage on sucsestful delete", async () => {
    const {_id} = await todoModel.saveTodo(testData.todoList);
    const res = await request.delete(`/todo/${_id}`);
    expect(res.status).toBe(200);
    expect(res.body.massage).toEqual("todo deleted");
  });

  it("todo deleted from db", async () => {
    const {_id} = await todoModel.saveTodo(testData.todoList);
    const res = await request.delete(`/todo/${_id}`);
    const todos = todoModel.find({});
    expect(todos.length).toBe(0);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
