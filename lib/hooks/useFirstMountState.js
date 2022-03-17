"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var useFirstMountState = function useFirstMountState() {
  var isFirst = (0, _react.useRef)(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return isFirst.current;
};

var _default = useFirstMountState;
exports.default = _default;
