"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _PanAndZoomControls = _interopRequireDefault(require("./PanAndZoomControls"));

var _usePanAndZoom2 = require("./hooks/usePanAndZoom");

var _jsxFileName = "/Users/chicho/repos/react-virtualized-flowchart/src/PanAndZoomContainer.js";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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

  return /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, STYLES), {}, {
      position: "relative"
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    }
  }, /*#__PURE__*/React.createElement("div", (0, _extends2.default)({
    style: _objectSpread(_objectSpread({}, STYLES), {}, {
      overflow: "auto"
    }),
    onScroll: handleScroll,
    ref: combinedRef
  }, panZoomHandlers, {
    className: "diagramContainer",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: diagramContainerRef,
    style: _objectSpread(_objectSpread({}, STYLES), {}, {
      overflow: "visible",
      position: "relative"
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    }
  }, children({
    zoom: zoom
  })))), /*#__PURE__*/React.createElement(_PanAndZoomControls.default, {
    zoom: zoom,
    decrementZoom: decrementZoom,
    incrementZoom: incrementZoom,
    resetZoom: resetZoom,
    renderPanAndZoomControls: renderPanAndZoomControls,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    }
  }));
};

var _default = PanAndZoomContainer;
exports.default = _default;