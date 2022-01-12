"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connections = exports.nodes = void 0;
var nodes = [{
  id: "1",
  label: 1,
  height: 30,
  width: 30,
  top: 0,
  left: 100
}, {
  id: "2",
  label: 2,
  height: 30,
  width: 30,
  top: 100,
  left: 0
}, {
  id: "3",
  label: 3,
  height: 30,
  width: 30,
  top: 100,
  left: 200
}];
exports.nodes = nodes;
var connections = [{
  id: "1-2",
  sourceId: "1",
  targetId: "2"
}, {
  id: "1-3",
  sourceId: "1",
  targetId: "3"
}];
/*

const X_RANGE = [0, 2000];
const Y_RANGE = [0, 3000];

const WIDTH_RANGE = [100, 300];
const HEIGHT_RANGE = [100, 300];

function generateRandomNumber(lower, upper) {
 return Math.floor(Math.random() * (upper - lower)) + lower;
}

function getVertex(index) {
 const left = generateRandomNumber(X_RANGE[0], X_RANGE[1]);
 const top = generateRandomNumber(Y_RANGE[0], Y_RANGE[1]);
 const width = generateRandomNumber(WIDTH_RANGE[0], WIDTH_RANGE[1]);
 const height = generateRandomNumber(HEIGHT_RANGE[0], HEIGHT_RANGE[1]);

 return {
  left,
  top,
  width,
  height,
  label: index,
  id: index,
 }
}

const nodes = [...Array(100)].map((a, i) => getVertex(i));
const connections = [];

const VERTEX_WIDTH = 250;
const VERTEX_HEIGHT = 250;
const CONNECTION_LENGTH = 25;

const TOTAL_VERTICES_IN_A_ROW = (X_RANGE[1] - X_RANGE[0]) / (VERTEX_WIDTH + CONNECTION_LENGTH);
const TOTAL_NUM_OF_ROWS = (Y_RANGE[1] - Y_RANGE[0]) / (VERTEX_HEIGHT + CONNECTION_LENGTH);

function getArrangedVertices() {
 const vertices = [];
 for (let y = 0; y < TOTAL_NUM_OF_ROWS; y++) {
  for (let x = 0; x < TOTAL_VERTICES_IN_A_ROW; x++) {
   vertices.push({
    left: x * (VERTEX_WIDTH + CONNECTION_LENGTH),
    top: y * (VERTEX_HEIGHT + CONNECTION_LENGTH),
    width: VERTEX_WIDTH,
    height: VERTEX_HEIGHT,
    label: `${x}-${y}`,
    id: `${x}-${y}`,
   })
  }
 }

 return vertices
}

export const vertices = getArrangedVertices();
export {nodes};
export {connections};

*/

exports.connections = connections;