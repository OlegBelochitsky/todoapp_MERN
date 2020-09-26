import express from "express";

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/", (req, res) => {
  res.status(400);
  res.end();
});

let testables;

if (NODE_ENV in ["development", "production"]) {
  /* listen on port */
  app
    .listen(PORT, () => console.log(`server running on http:${HOST}:${PORT}`))
    .on("error", (e) => {
      console.error(e.message);
      throw e;
    });
} else if (NODE_ENV == "test") {
  testables = { app };
} else {
  console.log("Bad NODE_ENV, should be one of: development/production/test");
}

export { testables };
