import BFS from "../util/bfs.js";

function isHasChilds(node, childFieldName) {
  return Boolean(node?.[childFieldName]);
}

async function getBfsTraversalOf(root, childFieldName) {
  const bfsTraversal = [];
  for await (const n of BFS(root, childFieldName, (n) => n)) {
    bfsTraversal.push(n);
  }
  return bfsTraversal;
}

function createNumberMappers(nodes) {
  const numberToNode = new Map();
  const nodeToNumber = new Map();
  for (let i = 0; i < nodes.length; i++) {
    numberToNode.set(i, nodes[i]);
    nodeToNumber.set(nodes[i], i);
  }
  return { numberToNode, nodeToNumber };
}

function creatreArrayOfEmptyArrays(numberOfEmptyArrays) {
  const array = [];
  for (let i = 0; i < numberOfEmptyArrays; i++) {
    array.push([]);
  }
  return array;
}


async function toAdjacencyList(root, childFieldName) {
  const bfsTraversal = await getBfsTraversalOf(root, childFieldName);
  const { numberToNode, nodeToNumber } = createNumberMappers(bfsTraversal);
  const inVertices = creatreArrayOfEmptyArrays(bfsTraversal.length);
  const outVertices = creatreArrayOfEmptyArrays(bfsTraversal.length);

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
