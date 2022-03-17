"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CENTER = exports.STEP_SIZE = exports.MAX_ZOOM = exports.MIN_ZOOM = exports.PLUMB_INSTANCE_INITIAL_STATE = exports.DIAGRAM_INITIAL_STATE = exports.DEFAULT_CONTAINER_RECT = exports.MARGIN = void 0;
var MARGIN = 100;
exports.MARGIN = MARGIN;
var DEFAULT_CONTAINER_RECT = {
  width: 0,
  height: 0
};
exports.DEFAULT_CONTAINER_RECT = DEFAULT_CONTAINER_RECT;
var DIAGRAM_INITIAL_STATE = {
  scroll: {
    left: 0,
    top: 0
  },
  version: 0,
  isContainerElReady: false
};
exports.DIAGRAM_INITIAL_STATE = DIAGRAM_INITIAL_STATE;
var PLUMB_INSTANCE_INITIAL_STATE = {
  overlayEdges: []
};
exports.PLUMB_INSTANCE_INITIAL_STATE = PLUMB_INSTANCE_INITIAL_STATE;
var MIN_ZOOM = 0.2;
exports.MIN_ZOOM = MIN_ZOOM;
var MAX_ZOOM = 1.8;
exports.MAX_ZOOM = MAX_ZOOM;
var STEP_SIZE = 0.2;
exports.STEP_SIZE = STEP_SIZE;
var CENTER = {
  x: 0,
  y: 0
};
exports.CENTER = CENTER;
