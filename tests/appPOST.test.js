import supertest from "supertest";
import todoModel from "../models/todo.js";
import testData from "./testData.json";
import { testables } from "../app.js";

const { app } = testables;
const request = supertest(app);

test("Should failed when env not test ", () => {
  expect(process.env.NODE_ENV).toEqual("test");
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

describe("POST /todo", () => {
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
      description: testData.description,
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
      response.body.todo.subTodos[0].description ==
        validTodo.subTodos[0].description ||
        response.body.todo.subTodos[0].description ==
          validTodo.subTodos[1].description
    ).toEqual(true);
  });

  it("saved todo saved with isRoot=true", async () => {
    const validTodo = testData.todoList;
    const res = await request
      .post("/todo")
      .set("Accept", /json/)
      .send(validTodo);
    expect(res.body.todo.isRoot).toBe(true);
  });
});
