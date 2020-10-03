import BFS from "./bfs.js";

function isTodoHasDescription(todo) {
  return Boolean(todo?.description);
}

function isBodyValid(body) {
  const { bfsTraversal, isTree } = BFS(body, "subTodos");
  if (!isTree) return false;

  for (const todo of bfsTraversal) {
    if (!isTodoHasDescription(todo)) return false;
  }
  return true;
}

export default isBodyValid;
