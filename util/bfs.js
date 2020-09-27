const visited = Symbol("visited");

function markVisited(node) {
  node[visited] = true;
}

function isVisited(node) {
  return Boolean(node?.[visited]);
}

function isHasChilds(node, getChildren) {
  const children = getChildren(node);
  return Boolean( children?.length > 0);
}

async function* BFS(root, getChildren, explore) {
  const queue = [];
  queue.push(root);

  while (queue.length !== 0) {
    let node = queue.shift();

    if (!isVisited(node)) {
      yield await explore(node);

      markVisited(node);

      if (isHasChilds(node, getChildren)) {
        const children = getChildren(node);
        children.forEach((n) => {
          if (!isVisited(n)) queue.push(n);
        });
      }
    }
  }
  return;
}

export default BFS;
