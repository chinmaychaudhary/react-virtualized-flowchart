const nodes = [
  {
    id: "4",
    label: 4,
    position: {
      top: 50,
      left: 400
    }
  },
  {
    id: "5",
    label: 5,
    position: {
      top: 150,
      left: 300
    }
  },
  {
    id: "6",
    label: 6,
    position: {
      top: 150,
      left: 500
    }
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
