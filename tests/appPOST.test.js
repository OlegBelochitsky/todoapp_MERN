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
  it("", async () => {
  });
});

describe("POST /todo", () => {
  afterEach((done) => {
    todoModel.deleteMany({}, done);
  });

  it("", async () => {
  });
});

