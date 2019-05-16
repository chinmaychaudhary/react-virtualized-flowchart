const nodes = [
  {
    id: "4",
    label: 4,
    top: 350,
    left: 400,
    height: 30,
    width: 30
  },
  {
    id: "5",
    label: 5,
    top: 450,
    left: 300,
    height: 30,
    width: 30
  },
  {
    id: "6",
    label: 6,
    top: 450,
    left: 500,
    height: 30,
    width: 30
  }
];

const connections = [
  {
    id: "4-5",
    sourceId: "4",
    targetId: "5"
  },
  {
    id: "4-6",
    sourceId: "4",
    targetId: "6"
  }
];

export { nodes };
export { connections };
