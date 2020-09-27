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
  //TODO warp nodes in {}
  //TODO transfer graph to adjacency list
  // adjacency list --> {
  //      nodeToNumber: map(key:{ node, }  , value:number),
  //      numberToNode: map(key:{ node, } , value:number),
  //      invertices:[ [], [], [] ], //  keeping track of the parent
  //      outvertices:[ [],[],[] ]   //  keeping track of the children
  //      }
  //TODO -save todo starting from childern,
  //     -push id to perents 'subTodos' ,
  //     -return root
  // for something like this:
  // for (const node of reversedBFS) {
  //   const objectID = saveTodo(node);
  //   const num = nodeToNumber.get(node);
  //   invertices[num].forEach((n) => {
  //     if (n?.childernID) {
  //       n.childernID.push(objectID);
  //     } else {
  //       n.childernID = [objectID];
  //     }
  //   });
  // }
  //
  if (callback instanceof Function) {
    return callback(location);
  } else {
    return location;
  }
};

const todoModel = mongoose.model("todos", todoSchema, "todos");
export default todoModel;
