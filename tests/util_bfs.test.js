import BFS from "../util/bfs.js";
import testData from "./testData.json";

describe("Testing async generator BFS", () => {
  it("can scan graph with one node", async () => {
    const generator = BFS(
      { data: 1 },
      (node) => node?.sons ?? [],
      (node) => node.data
    );
    const traverseOrder = [];
    for await (let item of generator) {
      traverseOrder.push(item);
    }
    expect(traverseOrder).toEqual([1]);
  });

  it("should scan test grap", async () => {
    const generator = BFS(
      testData.graph,
      (node) => node?.sons ?? [],
      (node) => node.data
    );
    const traverseOrder = [];
    for await (let item of generator) {
      traverseOrder.push(item);
    }
    expect(traverseOrder).toEqual([1, 2, 3, 4, 5]);
  });

  it("should work on cyclic graps", async () => {
    const cyclic = { data: 1, sons: [{ data: 2, sons: [] }] };
    cyclic.sons[0].sons.push(cyclic);
    const generator = BFS(
      cyclic,
      (node) => node?.sons ?? [],
      (node) => node.data
    );
    const traverseOrder = [];
    let counter = 0;
    for await (let item of generator) {
      traverseOrder.push(item);
      counter++;
      if (counter > 5) break; // to avoid infinity loop
    }
    expect(traverseOrder).toEqual([1, 2]);
  });
});
