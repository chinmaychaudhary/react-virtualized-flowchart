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

var _constants = require("./constants");

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
    scroll = _ref.scroll;
  var previousZoom = (0, React.useRef)(1);
  var diagramContainerRef = (0, React.useRef)();

  var _usePanZoom = (0, _usePanAndZoom.default)({
      enablePan: false,
      disableWheel: true,
      minZoom: _constants.MIN_ZOOM,
      maxZoom: _constants.MAX_ZOOM
    }),
    transform = _usePanZoom.transform,
    panZoomHandlers = _usePanZoom.panZoomHandlers,
    setContainer = _usePanZoom.setContainer,
    zoom = _usePanZoom.zoom,
    setZoom = _usePanZoom.setZoom;

  var incrementZoom = (0, React.useCallback)(
    function() {
      var incrementedZoom =
        Math.floor(zoom / _constants.STEP_SIZE + 1) * _constants.STEP_SIZE;

      setZoom(incrementedZoom, _constants.CENTER);
    },
    [zoom, setZoom]
  );
  var decrementZoom = (0, React.useCallback)(
    function() {
      var decrementedZoom =
        Math.floor((zoom - 0.01) / _constants.STEP_SIZE) * _constants.STEP_SIZE;

      setZoom(decrementedZoom, _constants.CENTER);
    },
    [zoom, setZoom]
  );
  var resetZoom = (0, React.useCallback)(
    function() {
      setZoom(1, _constants.CENTER);
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
  (0, React.useEffect)(
    function() {
      diagramContainerRef.current.style.transform = transform;
    },
    [transform]
  );
  (0, React.useLayoutEffect)(
    function() {
      containerRef.current.scrollBy({
        left:
          (scroll.left * (zoom - previousZoom.current)) / previousZoom.current,
        top: (scroll.top * (zoom - previousZoom.current)) / previousZoom.current
      });
      previousZoom.current = zoom;
    },
    [zoom]
  );
  return React.createElement(
    "div",
    {
      style: _objectSpread({}, STYLES, {
        position: "relative"
      }),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75
      }
    },
    React.createElement(
      "div",
      {
        style: STYLES,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
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
              lineNumber: 77
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
              lineNumber: 84
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
        lineNumber: 96
      }
    })
  );
};

var _default = PanAndZoomContainer;
exports.default = _default;
