import isBodyValid from "../../util/isBodyValid.js";
import testData from "../testData.json";

describe("Testing if isBodyValid can detect valid/invalid body of a todo", () => {
  it("todo with no description is invalid", async () => {
    const body = {
      description: "hello",
      subTodos: [{ noDescription: "world" }],
    };
    console.log('no description');
    expect(await isBodyValid(body)).toBe(false);
  });

  it("todo with cycle to be invalid", async () => {
    const cyclic = {
      description: "1",
      subTodos: [{ description: "2", subTodos: [] }],
    };
    cyclic.subTodos[0].subTodos.push(cyclic);
    console.log('cyclic');
    expect(await isBodyValid(cyclic )).toBe(false);
  });

  it("todo with non treelike structure is invalid", async () => {
    const todo1 = { description: "1", subTodos: [] };
    const todo2 = { description: "2", subTodos: [] };
    const todo3 = { description: "3", subTodos: [] };
    todo1.subTodos.push(todo2);
    todo1.subTodos.push(todo3);
    todo2.subTodos.push(todo3);

    console.log( todo3 === todo2.subTodos[0] );
    expect(await isBodyValid(todo1 )).toBe(false);
    todo2.subTodos.pop();
    todo3.subTodos.push(todo2);
    console.log( todo3 === todo2.pop() );
    expect(await isBodyValid(todo1 )).toBe(false);
  });

  it("valid todo to be valid", async () => {
    console.log('single valid');
    expect(await isBodyValid(testData.todoList)).toBe(true);
    console.log('valid');
    expect(await isBodyValid(testData.singleTodo)).toBe(true);
  });
});
