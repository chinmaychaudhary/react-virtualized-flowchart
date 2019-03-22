"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edges = exports.vertices = void 0;

var _objectSpread2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectSpread")
);

var VERTEX_WIDTH = 200;
var VERTEX_HEIGHT = 200;
var vertices = [
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
    top: 500,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "L1",
    id: "l1"
  },
  {
    left: 300 + VERTEX_WIDTH,
    top: 500,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1",
    id: "r1"
  },
  {
    left: 500 - VERTEX_WIDTH,
    top: 500 + 500,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1L2",
    id: "r1l2"
  },
  {
    left: 500 + VERTEX_WIDTH,
    top: 500 + 500,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1R2",
    id: "r1r2"
  },
  {
    left: 500 + VERTEX_WIDTH - VERTEX_WIDTH,
    top: 500 + 500 + 500,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1R2L3",
    id: "r1r2l3"
  },
  {
    left: 500 + VERTEX_WIDTH + VERTEX_WIDTH,
    top: 500 + 500 + 500,
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: "R1R2R3",
    id: "r1r2r3"
  }
].map(function(vertex) {
  return (0, _objectSpread2.default)({}, vertex, {
    top: vertex.top + 1000
  });
});
exports.vertices = vertices;
var edges = [
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
].map(function(edge) {
  return (0, _objectSpread2.default)({}, edge, {
    sourceId: edge.id.split("-")[0],
    targetId: edge.id.split("-")[1]
  });
});
exports.edges = edges;
