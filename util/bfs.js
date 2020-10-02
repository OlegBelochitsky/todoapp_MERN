function isHasChilds(node, childFieldName) {
  return Boolean(node?.[childFieldName]);
}

async function* BFS(root, childFieldName, explore) {
  const visitedMap = new Map();

  function markVisited(node) {
    visitedMap.set(node, true);
  }

  function isVisited(node) {
    return visitedMap.has(node);
  }

  const queue = [];
  queue.push(root);

  while (queue.length !== 0) {
    let node = queue.shift();

    yield await explore(node);

    markVisited(node);

    if (isHasChilds(node, childFieldName)) {
      node[childFieldName].forEach((n) => {
        if (!isVisited(n)) queue.push(n);
      });
    }
  }
  return;
}

export default BFS;
