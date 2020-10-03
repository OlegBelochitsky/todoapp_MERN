import isBodyValid from "../../util/isBodyValid.js";
import testData from "../testData.json";

describe("Testing if isBodyValid can detect valid/invalid body of a todo", () => {
  it("todo with no description is invalid", () => {
    const body = {
      description: "hello",
      subTodos: [{ noDescription: "world" }],
    };
    expect(isBodyValid(body)).toBe(false);
  });

  it("todo with cycle to be invalid", () => {
    const cyclic = {
      description: "1",
      subTodos: [{ description: "2", subTodos: [] }],
    };
    cyclic.subTodos[0].subTodos.push(cyclic);
    expect(isBodyValid(cyclic)).toBe(false);
  });

  it("todo with non treelike structure is invalid", () => {
    const todo1 = { description: "1", subTodos: [] };
    const todo2 = { description: "2", subTodos: [] };
    const todo3 = { description: "3", subTodos: [] };
    todo1.subTodos.push(todo2);
    todo1.subTodos.push(todo3);
    todo2.subTodos.push(todo3);

    expect(isBodyValid(todo1)).toBe(false);
    todo2.subTodos.pop();
    todo3.subTodos.push(todo2);
    expect(isBodyValid(todo1)).toBe(false);
  });

  it("valid todo to be valid", () => {
    expect(isBodyValid(testData.todoList)).toBe(true);
    expect(isBodyValid(testData.singleTodo)).toBe(true);
  });
});
