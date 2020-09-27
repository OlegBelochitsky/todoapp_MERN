import express from "express";
import mongoose from "mongoose";
import todoRouter from "./routes/todo.js";

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to mongoose"));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`got ${req.method} request with route: ${req.url}`);
  next();
});

app.use("/todo", todoRouter);

app.use("/", (req, res) => {
  res.status(400);
  res.end();
});

let testables;
if (["development", "production"].includes(NODE_ENV)) {
  app
    .listen(PORT, () => console.log(`server running on http:${HOST}:${PORT}`))
    .on("error", (e) => {
      console.error(e.message);
      throw e;
    });
} else if (NODE_ENV == "test") {
  testables = { app };
} else {
  console.log(
    `Bad NODE_ENV:${NODE_ENV}, should be one of: development/production/test`
  );
}

export { testables };
