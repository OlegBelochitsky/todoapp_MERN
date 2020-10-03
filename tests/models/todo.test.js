import mongoose from "mongoose";
import todoModel from "../../models/todo.js";
import testData from "../testData.json";
import BFS from "../../util/bfs.js";

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
      todo?.subTodos[0]?.subTodos[0]?.description ??
        todo?.subTodos[1]?.subTodos[0]?.description
    );
  });

  it("saveTodo Can use callback function", (done) => {
    function callback() {
      done();
    }
    todoModel.saveTodo(testData.singleTodo, callback);
  });

  it("can populateAll populated todo", async () => {
    const root = await todoModel.saveTodo(testData.singleTodo);
    await todoModel.populateAll(root);
    expect(root.description).toEqual(testData.singleTodo.description);
  });

  it("can populateAll nested todo", async () => {
    const root = await todoModel.saveTodo(testData.todoList);
    await todoModel.populateAll(root);
    const { bfsTraversal: itemsFromDB } = BFS(root, "subTodos");
    const { bfsTraversal: itemsFromTestData } = BFS(
      testData.todoList,
      "subTodos"
    );
    itemsFromDB.sort((a, b) => a.description >= b.description);
    itemsFromTestData.sort((a, b) => a.description >= b.description);
    expect(itemsFromDB.length).toEqual(itemsFromTestData.length);
    for (let i = 0; i > itemsFromDB.length; i++) {
      fromDb = itemsFromDB[i];
      fromTest = itemsFromTestData[i];
      expect(fromTest.description).toEqual(fromDb.description);
    }
  });

  it("can populateAll nested todo with depth limit", async () => {
    const root = await todoModel.saveTodo(testData.todoList);
    await todoModel.populateAll(root, 1);

    expect(["subTodo1", "subTodo2"]).toContain(root.subTodos[0].description);
    expect(root.subTodos[0].subTodos?.[0]?.description).toBeUndefined();
    expect(root.subTodos[1].subTodos?.[0]?.description).toBeUndefined();
  });

  it("save new todo with updateTodo if todo not exist", async () => {
    const { _id } = await todoModel.updateTodo(testData.todoList);
    const todo = await todoModel.findOne({ _id: _id });
    expect(todo.description).toEqual(testData.todoList.description);
  });

  it("update saved todo", async () => {
    const root = await todoModel.saveTodo(testData.todoList);
    await todoModel.populateAll(root);
    root.subTodos[0].description = "new description";
    const { _id } = await todoModel.updateTodo(root);

    const todo = await todoModel.findOne({ _id: _id });
    await todoModel.populateAll(todo);
    expect(
      todo.subTodos[0].description == "new description" ||
        todo.subTodos[1].description == "new description"
    ).toBe(true);
  });

  it("deleteTodo delete todo", async () => {
    const todo = await todoModel.saveTodo(testData.singleTodo);
    await todoModel.populateAll(todo);
    await todoModel.deleteTodo(todo);
    const todos = await todoModel.find({});
    expect(todos.length).toBe(0);
  });

  it("deleteTodo delete todo's sub todos", async () => {
    const todo = await todoModel.saveTodo(testData.todoList);
    await todoModel.populateAll(todo);
    await todoModel.deleteTodo(todo);
    const todos = await todoModel.find({});
    expect(todos.length).toBe(0);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
