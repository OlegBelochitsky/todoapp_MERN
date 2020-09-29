import mongoose from "mongoose";
import todoModel from "../models/todo.js";
import testData from "./testData.json";
import { getBfsTraversalOf } from "../util/toAdjacencyList.js";

test("Should failed when env not test ", () => {
  expect(process.env.NODE_ENV).toEqual("test");
});

describe("Testing todo model", () => {
  beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(() => {
    return todoModel.deleteMany({});
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

  it("saveTodo Can use callback function", (done) => {
    function callback() {
      done();
    }
    todoModel.saveTodo(testData.singleTodo, callback);
  });

  it("can populateAll populated todo", async () => {
    const root = todoModel.saveTodo(testData.singleTodo, callback);
    const populated = todoModel.populateAll(root);
    expect(testData.singleTodo.description).toEqual(populated.description);
    expect(root.description).toEqual(populated.description);
  });

  it("can populateAll nested todo", async () => {
    const root = await todoModel.saveTodo(testData.todoList, callback);
    const populated = await todoModel.populateAll(root);
    const itemsFromDB = await getBfsTraversalOf(populated, "subTodos");
    const itemsFromTestData = await getBfsTraversalOf( testData.todoList, "subTodos");
    expect(itemsFromDB.sort()).toEqual(itemsFromTestData.sort());
  });

  it("can populateAll nested todo with depth limit", async () => {
    const root = await todoModel.saveTodo(testData.todoList, callback);
    const populated = await todoModel.populateAll(root,1);

    expect(["subTodo1", "subTodo2"]).toContain(populated.subTodos[0].description);
    expect(populated.subTodos[0].subTodos?.[0]?.description).toBeUndefined();
    expect(populated.subTodos[1].subTodos?.[0]?.description).toBeUndefined();
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
