"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connections = exports.nodes = void 0;
var nodes = [{
  id: "4",
  label: 4,
  top: 350,
  left: 400,
  height: 30,
  width: 30
}, {
  id: "5",
  label: 5,
  top: 450,
  left: 300,
  height: 30,
  width: 30
}, {
  id: "6",
  label: 6,
  top: 450,
  left: 500,
  height: 30,
  width: 30
}];
exports.nodes = nodes;
var connections = [{
  id: "4-5",
  sourceId: "4",
  targetId: "5"
}, {
  id: "4-6",
  sourceId: "4",
  targetId: "6"
}];
exports.connections = connections;