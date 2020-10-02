function isHasChilds(node, childFieldName) {
  return Boolean(node?.[childFieldName]);
}

function BFS(root, childFieldName) {
  const visitedMap = new Map();
  const bfsTraversal = [];
  let isTree = true;

  function markVisited(node) {
    visitedMap.set(node, 0);
  }

  function isVisited(node) {
    return visitedMap.has(node);
  }

  const queue = [];
  queue.push(root);

  while (queue.length !== 0) {
    let node = queue.shift();
    bfsTraversal.push(node);
    markVisited(node);
    if (isHasChilds(node, childFieldName)) {
      node[childFieldName].forEach((n) => {
        if (!isVisited(n)) queue.push(n);
        else isTree = false;
      });
    }
  }
  return { bfsTraversal , isTree };
}

export default BFS;
