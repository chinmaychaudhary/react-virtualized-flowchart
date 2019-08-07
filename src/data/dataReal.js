const VERTEX_WIDTH = 200;
const VERTEX_HEIGHT = 200;

const LEVEL1 = 1500;
const LEVEL2 = 1500;
const LEVEL3 = 1500;

const vertices = [
  {
    left: 300,
    top: 100,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "Root",
    id: "r"
  },
  {
    left: 300 - VERTEX_WIDTH,
    top: LEVEL1,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "L1",
    id: "l1"
  },
  {
    left: 300 + VERTEX_WIDTH,
    top: LEVEL1,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1",
    id: "r1"
  },
  {
    left: 500 - VERTEX_WIDTH,
    top: LEVEL1 + LEVEL2,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1L2",
    id: "r1l2"
  },
  {
    left: 500 + VERTEX_WIDTH,
    top: LEVEL1 + LEVEL2,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1R2",
    id: "r1r2"
  },
  {
    left: 500 + VERTEX_WIDTH - VERTEX_WIDTH,
    top: LEVEL1 + LEVEL2 + LEVEL3,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1R2L3",
    id: "r1r2l3"
  },
  {
    left: 500 + VERTEX_WIDTH + VERTEX_WIDTH,
    top: LEVEL1 + LEVEL2 + LEVEL3,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1R2R3",
    id: "r1r2r3"
  }
].map(vertex => ({ ...vertex, top: vertex.top + 1000 }));

const edges = [
  {
    id: "r-l1"
  },
  {
    id: "r-r1"
  },
  {
    id: "r1-r1l2"
  },
  {
    id: "r1-r1r2"
  },
  {
    id: "r1r2-r1r2l3"
  },
  {
    id: "r1r2-r1r2r3"
  }
].map(edge => ({
  ...edge,
  sourceId: edge.id.split("-")[0],
  targetId: edge.id.split("-")[1]
}));

export { vertices };
export { edges };
