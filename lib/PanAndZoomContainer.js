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

var _PanAndZoomControls = _interopRequireDefault(
  require("./PanAndZoomControls")
);

var _usePanAndZoom2 = require("./hooks/usePanAndZoom");

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

var STYLES = {
  height: "100%",
  width: "100%"
};

var PanAndZoomContainer = function PanAndZoomContainer(_ref) {
  var children = _ref.children,
    handleScroll = _ref.handleScroll,
    containerRef = _ref.containerRef,
    renderPanAndZoomControls = _ref.renderPanAndZoomControls,
    scroll = _ref.scroll,
    contentSpan = _ref.contentSpan;

  var _usePanAndZoom = (0, _usePanAndZoom2.usePanAndZoom)({
      containerRef: containerRef,
      scroll: scroll,
      contentSpan: contentSpan
    }),
    zoom = _usePanAndZoom.zoom,
    panZoomHandlers = _usePanAndZoom.panZoomHandlers,
    combinedRef = _usePanAndZoom.combinedRef,
    diagramContainerRef = _usePanAndZoom.diagramContainerRef,
    incrementZoom = _usePanAndZoom.incrementZoom,
    decrementZoom = _usePanAndZoom.decrementZoom,
    resetZoom = _usePanAndZoom.resetZoom;

  return React.createElement(
    "div",
    {
      style: _objectSpread({}, STYLES, {
        position: "relative"
      }),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      }
    },
    React.createElement(
      "div",
      {
        style: STYLES,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 35
        }
      },
      React.createElement(
        "div",
        (0, _extends2.default)(
          {
            style: _objectSpread({}, STYLES, {
              overflow: "auto"
            }),
            onScroll: handleScroll,
            ref: combinedRef
          },
          panZoomHandlers,
          {
            className: "diagramContainer",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 36
            }
          }
        ),
        React.createElement(
          "div",
          {
            ref: diagramContainerRef,
            style: _objectSpread({}, STYLES, {
              overflow: "visible",
              position: "relative"
            }),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 43
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
        lineNumber: 55
      }
    })
  );
};

var _default = PanAndZoomContainer;
exports.default = _default;
