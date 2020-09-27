import graphItemWrapper from "../util/graphItemWrapper.js";
import BFS from "../util/bfs.js";
import testData from "./testData.json";

describe("testing graph item wrapper", () => {
  it("can warp graph with one node", () => {
    const graph ={ data: 1 };
    const newRoot = graphItemWrapper(graph, "sons", (node) => ({ node }));
    const notWrappedGenerator = BFS();
    const wrappedGenerator = BFS();
  });

  it("can warp graph with alot of nodes", () => {
    const newRoot = graphItemWrapper(testData.graph, "sons", (node) => ({ node }));
    const notWrappedGenerator = BFS(testData.graph, "sons",n => n );
    const wrappedGenerator = BFS(newRoot, "sons",n => n );
  });
});
