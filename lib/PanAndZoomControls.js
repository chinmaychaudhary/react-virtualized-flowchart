"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _jsxFileName = "/Users/chicho/repos/react-virtualized-flowchart/src/PanAndZoomControls.js";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
    return /*#__PURE__*/React.createElement(React.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      }
    }, renderPanAndZoomControls({
      zoom: zoom,
      decrementZoom: decrementZoom,
      incrementZoom: incrementZoom,
      resetZoom: resetZoom
    }));
  }

  return /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("button", {
    onClick: decrementZoom,
    style: BUTTON_STYLES,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    }
  }, "-"), /*#__PURE__*/React.createElement("button", {
    onClick: resetZoom,
    style: {
      height: "40px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    }
  }, "".concat(Math.round(zoom * 100), " %")), /*#__PURE__*/React.createElement("button", {
    onClick: incrementZoom,
    style: BUTTON_STYLES,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    }
  }, "+"));
};

var _default = PanAndZoomControls;
exports.default = _default;