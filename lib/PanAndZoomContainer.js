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

var _defineProperty2 = _interopRequireDefault(
  require("@babel/runtime/helpers/defineProperty")
);

var React = _interopRequireWildcard(require("react"));

var _usePanAndZoom = _interopRequireDefault(require("use-pan-and-zoom"));

var _PanAndZoomControls = _interopRequireDefault(
  require("./PanAndZoomControls")
);

var _jsxFileName =
  "/Users/ujjawalpabreja/Desktop/react-virtualized-flowchart/src/PanAndZoomContainer.js";

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty2.default)(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

var MIN_ZOOM = 0.25;
var MAX_ZOOM = 1.75;
var STEP_SIZE = 0.25;
var CENTER = {
  x: 0,
  y: 0
};
var DIMENSIONS_STYLES = {
  height: "100%",
  width: "100%"
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
      style: _objectSpread({}, DIMENSIONS_STYLES, {
        position: "relative"
      }),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62
      }
    },
    React.createElement(
      "div",
      {
        style: DIMENSIONS_STYLES,
        className: "flowchartContainer",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 63
        }
      },
      React.createElement(
        "div",
        (0, _extends2.default)(
          {
            style: _objectSpread({}, DIMENSIONS_STYLES, {
              overflow: "auto"
            }),
            onScroll: handleScroll,
            ref: combinedRef
          },
          panZoomHandlers,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 67
            }
          }
        ),
        React.createElement(
          "div",
          {
            style: _objectSpread({}, DIMENSIONS_STYLES, {
              overflow: "visible",
              position: "relative",
              transform: transform
            }),
            className: "diagramContainer",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 73
            }
          },
          children({
            zoom: zoom
          })
        )
      )
    ),
    React.createElement(_PanAndZoomControls.default, {
      zoom: zoom,
      decrementZoom: decrementZoom,
      incrementZoom: incrementZoom,
      resetZoom: resetZoom,
      renderPanAndZoomControls: renderPanAndZoomControls,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 86
      }
    })
  );
};

var _default = PanAndZoomContainer;
exports.default = _default;
