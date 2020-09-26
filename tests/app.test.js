import supertest from "supertest";
import { testables } from "../app.js";
const { app } = testables;
const request = supertest(app);

describe("GET /", () => {
  it("response with 400", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(400);
  });
});
