import BFS from "../../util/bfs.js";
import testData from "../testData.json";

describe("Testing BFS", () => {
  it("can scan graph with one node", () => {
    const { bfsTraversal, isTree } = BFS({ data: 1 }, "sons");
    expect(bfsTraversal.map((n) => n.data)).toEqual([1]);
    expect(isTree).toBe(true);
  });

  it("should scan test grap", () => {
    const { bfsTraversal, isTree } = BFS(testData.graph, "sons");
    expect(bfsTraversal.map((n) => n.data)).toEqual([1, 2, 3, 4, 5]);
    expect(isTree).toBe(true);
  });

  it("should work on cyclic graps", () => {
    const cyclic = { data: 1, sons: [{ data: 2, sons: [] }] };
    cyclic.sons[0].sons.push(cyclic);

    const { bfsTraversal, isTree } = BFS(cyclic, "sons");
    expect(bfsTraversal.map((n) => n.data)).toEqual([1, 2]);
    expect(isTree).toBe(false);
  });

  it("can work on same graph many times", () => {
    const firstRun = BFS(testData.graph, "sons");

    const secondRun = BFS(testData.graph, "sons");

    expect(firstRun.bfsTraversal.map((n) => n.data)).toEqual([1, 2, 3, 4, 5]);
    expect(firstRun.isTree).toBe(true);
    expect(secondRun.bfsTraversal.map((n) => n.data)).toEqual([1, 2, 3, 4, 5]);
    expect(secondRun.isTree).toBe(true);
  });
});
