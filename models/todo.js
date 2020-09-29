import mongoose from "mongoose";
import toAdjacencyList from "../util/toAdjacencyList.js";
import {
  getBfsTraversalOf,
  creatreArrayOfEmptyArrays,
} from "../util/toAdjacencyList.js";

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
  const bfsTraversal = await getBfsTraversalOf(todos, "subTodos");
  const {
    numberToNode,
    nodeToNumber,
    inVertices,
    outVertices,
  } = await toAdjacencyList(todos, "subTodos");
  const savedChildrenObjIds = creatreArrayOfEmptyArrays(bfsTraversal.length);
  const reverseBfs = bfsTraversal.slice().reverse();
  let lastSave;
  for (const todo of reverseBfs) {
    const nodeNum = nodeToNumber.get(todo);
    const toSave = {
      description: todo.description,
      done: todo.done,
      isRoot: todo.isRoot,
      subTodos: savedChildrenObjIds[nodeNum],
    };
    lastSave = await new this(toSave).save();
    const { _id } = lastSave;
    for (const perent of inVertices[nodeNum]) {
      savedChildrenObjIds[perent].push(_id);
    }
  }

  if (callback instanceof Function) {
    return callback(lastSave);
  } else {
    return lastSave;
  }
};

const todoModel = mongoose.model("todos", todoSchema, "todos");
export default todoModel;
