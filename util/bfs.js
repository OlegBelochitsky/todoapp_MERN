function isHasChilds(node, childFieldName) {
  return Boolean(node?.[childFieldName]);
}

async function* BFS(root, childFieldName, explore) {
  const visited = Symbol("visited");

  function markVisited(node) {
    node[visited] = true;
  }

  function isVisited(node) {
    return Boolean(node?.[visited]);
  }

  const queue = [];
  queue.push(root);

  while (queue.length !== 0) {
    let node = queue.shift();

    if (!isVisited(node)) {
      yield await explore(node);

      markVisited(node);

      if (isHasChilds(node, childFieldName)) {
        node[childFieldName].forEach((n) => {
          if (!isVisited(n)) queue.push(n);
        });
      }
    }
  }
  return;
}

export default BFS;
