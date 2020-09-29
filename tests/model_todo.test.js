import mongoose from "mongoose";
import todoModel from "../models/todo.js";
import testData from "./testData.json";

test("Should failed when env not test ", () => {
  expect(process.env.NODE_ENV).toEqual("test");
});

describe("Testing todo model", () => {
  beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URL);
  });

  afterEach(() => {
    return todoModel.remove({});
  });

  it("Should save a singleTodo", async () => {
    await todoModel.saveTodo(testData.singleTodo);
    const [todo] = await todoModel
      .find({ description: testData.singleTodo.description })
      .exec();
    expect(todo.description).toBe(testData.singleTodo.description);
  });

  it("Should save a todoList", async () => {
    await todoModel.saveTodo(testData.todoList);
    const [todo] = await todoModel
      .find({ description: testData.todoList.description })
      .populate({
        path: "subTodos",
        model: this,
        populate: {
          path: "subTodos",
          model: this,
        },
      });

    expect(todo.description).toBe(testData.todoList.description);
    expect(["subTodo1", "subTodo2"]).toContain(todo.subTodos[0].description);
    expect(["subSubTodo1", "subSubTodo2", "subSubTodo3"]).toContain(
      todo?.subTodos[0]?.subTodos[0].description ??
        todo?.subTodos[1]?.subTodos[0].description
    );
  });

  it("Can use callback function", (done) => {
    function callback() {
      done();
    }
    todoModel.saveTodo(testData.singleTodo, callback);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
