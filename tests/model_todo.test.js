import todoModel from "./todo.js";

test("Should failed when env not test ", () => {
  expect(process.env.NODE_ENV).toEqual("test");
});

describe("", () => {
  let comment;

  beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URL);
  });

  beforeEach(() => {
  });

  it();

  afterEach(() => {
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
