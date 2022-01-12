"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edges = exports.vertices = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var VERTEX_WIDTH = 200;
var VERTEX_HEIGHT = 200;
var LEVEL1 = 1500;
var LEVEL2 = 1500;
var LEVEL3 = 1500;
var vertices = [{
  left: 300,
  top: 100,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "Root",
  id: "r"
}, {
  left: 300 - VERTEX_WIDTH,
  top: LEVEL1,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "L1",
  id: "l1"
}, {
  left: 300 + VERTEX_WIDTH,
  top: LEVEL1,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "R1",
  id: "r1"
}, {
  left: 500 - VERTEX_WIDTH,
  top: LEVEL1 + LEVEL2,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "R1L2",
  id: "r1l2"
}, {
  left: 500 + VERTEX_WIDTH,
  top: LEVEL1 + LEVEL2,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "R1R2",
  id: "r1r2"
}, {
  left: 500 + VERTEX_WIDTH - VERTEX_WIDTH,
  top: LEVEL1 + LEVEL2 + LEVEL3,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "R1R2L3",
  id: "r1r2l3"
}, {
  left: 500 + VERTEX_WIDTH + VERTEX_WIDTH,
  top: LEVEL1 + LEVEL2 + LEVEL3,
  width: VERTEX_WIDTH,
  height: VERTEX_HEIGHT,
  label: "R1R2R3",
  id: "r1r2r3"
}].map(function (vertex) {
  return _objectSpread({}, vertex, {
    top: vertex.top + 1000
  });
});
exports.vertices = vertices;
var edges = [{
  id: "r-l1"
}, {
  id: "r-r1"
}, {
  id: "r1-r1l2"
}, {
  id: "r1-r1r2"
}, {
  id: "r1r2-r1r2l3"
}, {
  id: "r1r2-r1r2r3"
}].map(function (edge) {
  return _objectSpread({}, edge, {
    sourceId: edge.id.split("-")[0],
    targetId: edge.id.split("-")[1]
  });
});
exports.edges = edges;