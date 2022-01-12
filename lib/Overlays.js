"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helper = require("./helper");

var Overlays = (0, _react.memo)(function (props) {
  return props.renderOverlays(props.edges, _helper.getOverlayId);
});
Overlays.displayName = "Overlays";
Overlays.propTypes = {
  edges: _propTypes.default.array.isRequired,
  renderOverlays: _propTypes.default.func.isRequired
};
var _default = Overlays;
exports.default = _default;