"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePanAndZoom = void 0;

var _react = require("react");

var _usePanAndZoom = _interopRequireDefault(require("use-pan-and-zoom"));

var _constants = require("../constants");

var _helper = require("../helper");

var usePanAndZoom = function usePanAndZoom(_ref) {
  var containerRef = _ref.containerRef,
      scroll = _ref.scroll,
      contentSpan = _ref.contentSpan;
  var previousZoom = (0, _react.useRef)(_constants.DEFAULT_ZOOM);
  var diagramContainerRef = (0, _react.useRef)();

  var _usePanZoom = (0, _usePanAndZoom.default)({
    enablePan: false,
    disableWheel: true,
    minZoom: _constants.MIN_ZOOM,
    maxZoom: _constants.MAX_ZOOM
  }),
      panZoomHandlers = _usePanZoom.panZoomHandlers,
      setContainer = _usePanZoom.setContainer,
      zoom = _usePanZoom.zoom,
      pan = _usePanZoom.pan,
      setZoom = _usePanZoom.setZoom;

  var incrementZoom = (0, _react.useCallback)(function () {
    var incrementedZoom = zoom + _constants.STEP_SIZE;
    setZoom(incrementedZoom, _constants.CENTER);
  }, [zoom, setZoom]);
  var decrementZoom = (0, _react.useCallback)(function () {
    var decrementedZoom = zoom - _constants.STEP_SIZE;
    setZoom(decrementedZoom, _constants.CENTER);
  }, [zoom, setZoom]);
  var resetZoom = (0, _react.useCallback)(function () {
    setZoom(_constants.DEFAULT_ZOOM, _constants.CENTER);
  }, [setZoom]);
  var combinedRef = (0, _react.useCallback)(function (el) {
    setContainer(el);
    containerRef.current = el;
  }, [setContainer]);
  (0, _react.useEffect)(function () {
    var container = containerRef.current;
    var clientWidth = container.clientWidth,
        clientHeight = container.clientHeight;

    var _getTranslate3DCoordi = (0, _helper.getTranslate3DCoordinates)(clientWidth, clientHeight, pan, zoom, contentSpan),
        translateX = _getTranslate3DCoordi.translateX,
        translateY = _getTranslate3DCoordi.translateY;

    diagramContainerRef.current.style.transform = "translate3D(".concat(translateX, "px, ").concat(translateY, "px, 0) scale(").concat(zoom, ")");

    var _getContainerScroll = (0, _helper.getContainerScroll)(scroll.left, scroll.top, zoom, previousZoom.current, clientWidth, clientHeight),
        scrollLeft = _getContainerScroll.scrollLeft,
        scrollTop = _getContainerScroll.scrollTop;

    container.scrollLeft = scrollLeft;
    container.scrollTop = scrollTop;
    previousZoom.current = zoom;
  }, [contentSpan.x, contentSpan.y, pan.x, pan.y, zoom]);
  (0, _react.useEffect)(function () {
    var container = containerRef.current;
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  }, []);
  return {
    zoom: zoom,
    panZoomHandlers: panZoomHandlers,
    combinedRef: combinedRef,
    diagramContainerRef: diagramContainerRef,
    incrementZoom: incrementZoom,
    decrementZoom: decrementZoom,
    resetZoom: resetZoom
  };
};

exports.usePanAndZoom = usePanAndZoom;