import mongoose from "mongoose";
import BFS from "../util/bfs.js";

const { Schema } = mongoose;

const todoSchema = Schema();
todoSchema.add({
  description: String,
  done: {
    type: Boolean,
    default: false,
  },
  isRoot: {
    type: Boolean,
    default: false,
  },
  subTodos: [{ type: Schema.Types.ObjectId, ref: "todos" }],
});

todoSchema.statics.saveTodo = async function (todos, callback) {
  //TODO reverse graph pointers
  //TODO save todo starting from childern, and push id to perents 'subTodos' , return root

  if (callback instanceof Function) {
    return callback(location);
  } else {
    return location;
  }
};

const todoModel = mongoose.model("todos", todoSchema, "todos");
export default todoModel;
