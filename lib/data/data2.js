"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connections = exports.nodes = void 0;
var nodes = [
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
exports.nodes = nodes;
var connections = [
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
exports.connections = connections;
