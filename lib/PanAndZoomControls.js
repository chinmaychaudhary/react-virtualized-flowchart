"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _jsxFileName =
  "/Users/ujjawalpabreja/Desktop/react-virtualized-flowchart/src/PanAndZoomControls.js";
var BUTTON_STYLES = {
  height: "40px",
  width: "40px"
};

var PanAndZoomControls = function PanAndZoomControls(_ref) {
  var zoom = _ref.zoom,
    decrementZoom = _ref.decrementZoom,
    incrementZoom = _ref.incrementZoom,
    resetZoom = _ref.resetZoom,
    renderPanAndZoomControls = _ref.renderPanAndZoomControls;

  if (renderPanAndZoomControls) {
    return React.createElement(
      React.Fragment,
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        }
      },
      renderPanAndZoomControls({
        zoom: zoom,
        decrementZoom: decrementZoom,
        incrementZoom: incrementZoom,
        resetZoom: resetZoom
      })
    );
  }

  return React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        alignItems: "center",
        margin: "20px",
        zIndex: 20,
        bottom: "0px",
        right: "0px"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 29
      }
    },
    React.createElement(
      "button",
      {
        onClick: decrementZoom,
        style: BUTTON_STYLES,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        }
      },
      "-"
    ),
    React.createElement(
      "button",
      {
        onClick: resetZoom,
        style: {
          height: "40px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        }
      },
      "".concat(Math.round(zoom * 100), " %")
    ),
    React.createElement(
      "button",
      {
        onClick: incrementZoom,
        style: BUTTON_STYLES,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        }
      },
      "+"
    )
  );
};

var _default = PanAndZoomControls;
exports.default = _default;
