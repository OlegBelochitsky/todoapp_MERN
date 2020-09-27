import mongoose from "mongoose";
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

todoSchema.statics.saveTodo = async function(data, callback){
    //  = new this(data);
    // user.save(callback);
  callback();
};

const todoModel = mongoose.model("todos", todoSchema, "todos");
export default todoModel; 
