"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(
  require("@babel/runtime/helpers/extends")
);

var React = _interopRequireWildcard(require("react"));

var _usePanAndZoom = _interopRequireDefault(require("use-pan-and-zoom"));

var _PanAndZoomControls = _interopRequireDefault(
  require("./PanAndZoomControls")
);

var _jsxFileName =
  "/Users/ujjawalpabreja/Desktop/react-virtualized-flowchart/src/PanAndZoomContainer.js";
var MIN_ZOOM = 0.25;
var MAX_ZOOM = 1.75;
var STEP_SIZE = 0.25;
var CENTER = {
  x: 0,
  y: 0
};

var PanAndZoomContainer = function PanAndZoomContainer(_ref) {
  var children = _ref.children,
    handleScroll = _ref.handleScroll,
    containerRef = _ref.containerRef,
    renderPanAndZoomControls = _ref.renderPanAndZoomControls;

  var _usePanZoom = (0, _usePanAndZoom.default)({
      enablePan: false,
      disableWheel: true,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM
    }),
    transform = _usePanZoom.transform,
    panZoomHandlers = _usePanZoom.panZoomHandlers,
    setContainer = _usePanZoom.setContainer,
    zoom = _usePanZoom.zoom,
    setZoom = _usePanZoom.setZoom;

  var incrementZoom = (0, React.useCallback)(
    function() {
      var incrementedZoom = Math.floor(zoom / STEP_SIZE + 1) * STEP_SIZE;
      setZoom(incrementedZoom, CENTER);
    },
    [zoom, setZoom]
  );
  var decrementZoom = (0, React.useCallback)(
    function() {
      var decrementedZoom = Math.floor((zoom - 0.01) / STEP_SIZE) * STEP_SIZE;
      setZoom(decrementedZoom, CENTER);
    },
    [zoom, setZoom]
  );
  var resetZoom = (0, React.useCallback)(
    function() {
      setZoom(1, CENTER);
    },
    [setZoom]
  );
  var combinedRef = (0, React.useCallback)(
    function(el) {
      setContainer(el);
      containerRef.current = el;
    },
    [setContainer]
  );
  return React.createElement(
    "div",
    {
      style: {
        height: "100%",
        width: "100%",
        position: "relative"
      },
      className: "flowchartContainer",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57
      }
    },
    React.createElement(
      "div",
      (0, _extends2.default)(
        {
          style: {
            height: "100%",
            width: "100%",
            overflow: "auto"
          },
          onScroll: handleScroll,
          ref: combinedRef
        },
        panZoomHandlers,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 61
          }
        }
      ),
      children({
        transform: transform
      })
    ),
    React.createElement(_PanAndZoomControls.default, {
      zoom: zoom,
      decrementZoom: decrementZoom,
      incrementZoom: incrementZoom,
      resetZoom: resetZoom,
      renderPanAndZoomControls: renderPanAndZoomControls,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 69
      }
    })
  );
};

var _default = PanAndZoomContainer;
exports.default = _default;
