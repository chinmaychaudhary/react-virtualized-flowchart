"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connections = exports.nodes = exports.vertices = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var X_RANGE = [0, 2000];
var Y_RANGE = [0, 3000];
var WIDTH_RANGE = [100, 300];
var HEIGHT_RANGE = [100, 300];

function generateRandomNumber(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}

function getVertex(index) {
  var left = generateRandomNumber(X_RANGE[0], X_RANGE[1]);
  var top = generateRandomNumber(Y_RANGE[0], Y_RANGE[1]);
  var width = generateRandomNumber(WIDTH_RANGE[0], WIDTH_RANGE[1]);
  var height = generateRandomNumber(HEIGHT_RANGE[0], HEIGHT_RANGE[1]);
  return {
    left: left,
    top: top,
    width: width,
    height: height,
    label: index,
    id: index
  };
}

var nodes = (0, _toConsumableArray2.default)(Array(100)).map(function(a, i) {
  return getVertex(i);
});
exports.nodes = nodes;
var connections = [];
exports.connections = connections;
var VERTEX_WIDTH = 250;
var VERTEX_HEIGHT = 250;
var CONNECTION_LENGTH = 25;
var TOTAL_VERTICES_IN_A_ROW =
  (X_RANGE[1] - X_RANGE[0]) / (VERTEX_WIDTH + CONNECTION_LENGTH);
var TOTAL_NUM_OF_ROWS =
  (Y_RANGE[1] - Y_RANGE[0]) / (VERTEX_HEIGHT + CONNECTION_LENGTH);

function getArrangedVertices() {
  var vertices = [];

  for (var y = 0; y < TOTAL_NUM_OF_ROWS; y++) {
    for (var x = 0; x < TOTAL_VERTICES_IN_A_ROW; x++) {
      vertices.push({
        left: x * (VERTEX_WIDTH + CONNECTION_LENGTH),
        top: y * (VERTEX_HEIGHT + CONNECTION_LENGTH),
        width: VERTEX_WIDTH,
        height: VERTEX_HEIGHT,
        label: "".concat(x, "-").concat(y),
        id: "".concat(x, "-").concat(y)
      });
    }
  }

  return vertices;
}

var vertices = getArrangedVertices();
exports.vertices = vertices;
