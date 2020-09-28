import BFS from "../util/bfs.js";

function isHasChilds(node, childFieldName) {
  return Boolean(node?.[childFieldName]);
}

async function toAdjacencyList(root, childFieldName) {
  const bfsTraversal = [];
  for await (const n of BFS(root, childFieldName, (n) => n)) {
    bfsTraversal.push(n);
  }

  const numberToNode = new Map();
  const nodeToNumber = new Map();
  const inVertices = [];
  const outVertices = [];
  for (let i = 0; i < bfsTraversal.length; i++) {
    numberToNode.set(i, bfsTraversal[i]);
    nodeToNumber.set(bfsTraversal[i], i);
    inVertices.push([]);
    outVertices.push([]);
  }

  bfsTraversal.forEach((n) => {
    const num = nodeToNumber.get(n);
    if (isHasChilds(n, childFieldName)) {
      n[childFieldName].forEach((c) => {
        outVertices[num].push(nodeToNumber.get(c));
        inVertices[nodeToNumber.get(c)].push(nodeToNumber.get(n));
      });
    }
  });

  return { numberToNode, nodeToNumber, inVertices, outVertices };
}

export default toAdjacencyList;
