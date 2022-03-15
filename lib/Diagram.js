"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _defineProperty2 = _interopRequireDefault(
  require("@babel/runtime/helpers/defineProperty")
);

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _usePrevious = _interopRequireDefault(require("react-use/lib/usePrevious"));

var _Edges = _interopRequireDefault(require("./Edges"));

var _PanAndZoomContainer = _interopRequireDefault(
  require("./PanAndZoomContainer")
);

var _useIntervalTree2 = _interopRequireDefault(
  require("./hooks/useIntervalTree")
);

var _useEdgesAndVertices2 = _interopRequireDefault(
  require("./hooks/useEdgesAndVertices")
);

var _helper = require("./helper");

var _constants = require("./constants");

var _jsxFileName =
  "/Users/ujjawalpabreja/Desktop/react-virtualized-flowchart/src/Diagram.js";

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

var Diagram = function Diagram(props) {
  var prevEdges = (0, _usePrevious.default)(props.edges);
  var prevVertices = (0, _usePrevious.default)(props.vertices);

  var _useState = (0, React.useState)(_constants.DIAGRAM_INITIAL_STATE),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];

  var containerRef = (0, React.useRef)();

  var _useEdgesAndVertices = (0, _useEdgesAndVertices2.default)(
      props.edges,
      props.vertices
    ),
    vertices = _useEdgesAndVertices.vertices,
    verticesMapRef = _useEdgesAndVertices.verticesMapRef,
    verticesToEdgesMapRef = _useEdgesAndVertices.verticesToEdgesMapRef,
    setVertices = _useEdgesAndVertices.setVertices;

  var _useIntervalTree = (0, _useIntervalTree2.default)(
      props.edges,
      verticesMapRef.current
    ),
    getVisibleEdgesHelper = _useIntervalTree.getVisibleEdgesHelper,
    updateIntervalTrees = _useIntervalTree.updateIntervalTrees,
    updateEdges = _useIntervalTree.updateEdges;

  var plumbInstanceRef = (0, React.useRef)();
  var validateNodesRef = (0, React.useRef)({
    revalidateNodes: false,
    verticesToBeValidated: []
  });
  (0, React.useEffect)(function() {
    setState(function(prevState) {
      return _objectSpread({}, prevState, {
        isContainerElReady: true
      });
    });
  }, []);
  (0, React.useEffect)(function() {
    var shouldTriggerRender = false;
    var didVerticesChange = prevVertices && prevVertices !== props.vertices;

    if (didVerticesChange) {
      verticesMapRef.current = setVertices(props.vertices).verticesMap;
    }

    if (validateNodesRef.current.revalidateNodes) {
      validateNodesRef.current.verticesToBeValidated.forEach(function(vertex) {
        return plumbInstanceRef.current.revalidate(vertex.id);
      });
      validateNodesRef.current = {
        revalidateNodes: false
      };
    }

    if (prevEdges && prevEdges !== props.edges) {
      verticesToEdgesMapRef.current = updateEdges(
        (0, _helper.getAddedOrRemovedItems)(prevEdges, props.edges),
        verticesMapRef.current,
        verticesToEdgesMapRef.current
      ).verticesToEdgesMap;
      shouldTriggerRender = true;
    }

    if (didVerticesChange) {
      var _getAddedOrRemovedIte = (0, _helper.getAddedOrRemovedItems)(
          prevVertices,
          props.vertices
        ),
        itemsAdded = _getAddedOrRemovedIte.itemsAdded,
        itemsRemoved = _getAddedOrRemovedIte.itemsRemoved;

      validateNodesRef.current = {
        revalidateNodes: true,
        verticesToBeValidated: itemsAdded
      };
      updateIntervalTrees(
        {
          itemsAdded: itemsAdded,
          itemsRemoved: itemsRemoved
        },
        verticesMapRef.current,
        verticesToEdgesMapRef.current
      );
      shouldTriggerRender = true;
    }

    if (shouldTriggerRender) {
      setState(function(prevState) {
        return _objectSpread({}, prevState, {
          version: prevState.version + 1
        });
      });
    }
  });
  var updateScroll = (0, React.useCallback)(
    (0, _throttle2.default)(function(target) {
      setState(function(prevState) {
        return _objectSpread({}, prevState, {
          scroll: {
            left: target.scrollLeft,
            top: target.scrollTop
          }
        });
      });
    }, 0),
    [setState]
  );
  var handleScroll = (0, React.useCallback)(
    function(e) {
      if (e.target !== e.currentTarget) {
        return;
      }

      updateScroll(e.currentTarget);
    },
    [updateScroll]
  );
  var getVisibleEdges = (0, React.useCallback)(
    function() {
      var zoom =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var scroll = state.scroll,
        version = state.version;

      var _ref = containerRef.current
          ? containerRef.current.getBoundingClientRect()
          : _constants.DEFAULT_CONTAINER_RECT,
        width = _ref.width,
        height = _ref.height;

      var scale = 1 / zoom;
      var scrollLeft = scroll.left * scale;
      var scrollTop = scroll.top * scale;
      var containerWidth = width * scale;
      var containerHeight = height * scale;
      return getVisibleEdgesHelper(
        (0, _helper.getViewport)(
          scrollLeft,
          scrollTop,
          containerWidth,
          containerHeight
        )
      );
    },
    [getVisibleEdgesHelper]
  );
  var getVisibleVertices = (0, React.useCallback)(
    function() {
      var zoom =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var version = state.version;
      return (0, _helper.getVisibleVerticesHelper)(
        verticesMapRef.current,
        getVisibleEdges(zoom),
        version
      );
    },
    [getVisibleEdges]
  );
  var getExtremeXAndY = (0, React.useCallback)(
    function() {
      var _getExtremeVertices = (0, _helper.getExtremeVertices)(vertices),
        rightMostVertex = _getExtremeVertices.rightMostVertex,
        bottomMostVertex = _getExtremeVertices.bottomMostVertex;

      var sentinelX =
        (0, _helper.getXUpper)(rightMostVertex) + _constants.MARGIN;

      var sentinelY =
        (0, _helper.getYUpper)(bottomMostVertex) + _constants.MARGIN;

      return [sentinelX, sentinelY];
    },
    [vertices]
  );
  var renderSentinel = (0, React.useCallback)(function(x, y) {
    return React.createElement("div", {
      style: {
        height: 1,
        width: 1,
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate3d(".concat(x, "px, ").concat(y, "px, 0)")
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 168
      }
    });
  }, []);
  var renderBackground = (0, React.useCallback)(
    function(x, y) {
      return props.renderBackground(x, y);
    },
    [props.renderBackground]
  );
  var renderVertices = (0, React.useCallback)(
    function(vertices, zoom) {
      return vertices.map(function(_ref2) {
        var vertex = _ref2.vertex,
          index = _ref2.index;
        return React.createElement(
          React.Fragment,
          {
            key: vertex.id,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 187
            }
          },
          props.renderVertex({
            vertex: vertex,
            index: index,
            zoom: zoom
          })
        );
      });
    },
    [props.renderVertex]
  );
  var renderEdges = (0, React.useCallback)(
    function(edgesMap, vertices) {
      if (!state.isContainerElReady) {
        return null;
      }

      return React.createElement(_Edges.default, {
        renderOverlays: props.renderOverlays,
        plumbInstanceRef: plumbInstanceRef,
        onAction: props.onAction,
        edges: (0, _toConsumableArray2.default)(edgesMap.values()),
        vertices: vertices.map(function(v) {
          return v.vertex;
        }),
        containerEl: containerRef.current,
        sourceEndpointStyles: props.sourceEndpointStyles,
        sourceEndpointOptions: props.sourceEndpointOptions,
        targetEndpointStyles: props.targetEndpointStyles,
        targetEndpointOptions: props.targetEndpointOptions,
        edgeStyles: props.edgeStyles,
        draggableOptions: props.draggableOptions,
        droppableOptions: props.droppableOptions,
        areVerticesDraggable: props.areVerticesDraggable,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 199
        }
      });
    },
    [
      state.isContainerElReady,
      props.renderOverlays,
      props.onAction,
      props.sourceEndpointStyles,
      props.sourceEndpointOptions,
      props.targetEndpointStyles,
      props.targetEndpointOptions,
      props.edgeStyles,
      props.draggableOptions,
      props.droppableOptions,
      props.areVerticesDraggable
    ]
  );
  var renderChildren = (0, React.useCallback)(
    function(edges, vertices, extremeX, extremeY) {
      var zoom =
        arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      return React.createElement(
        React.Fragment,
        null,
        renderVertices(vertices, zoom),
        renderEdges(edges, vertices),
        renderSentinel(extremeX, extremeY),
        renderBackground(extremeX, extremeY)
      );
    },
    [renderVertices, renderEdges, renderSentinel, renderBackground]
  );

  if (props.enableZoom) {
    return React.createElement(
      _PanAndZoomContainer.default,
      {
        handleScroll: handleScroll,
        containerRef: containerRef,
        renderPanAndZoomControls: props.renderPanAndZoomControls,
        scroll: state.scroll,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 232
        }
      },
      function(_ref3) {
        var zoom = _ref3.zoom;
        var visibleVerticesMap = getVisibleVertices(zoom);
        var edges = getVisibleEdges(zoom);
        var visibleVertices = (0, _toConsumableArray2.default)(
          visibleVerticesMap.values()
        );

        var _getExtremeXAndY = getExtremeXAndY(),
          _getExtremeXAndY2 = (0, _slicedToArray2.default)(_getExtremeXAndY, 2),
          extremeX = _getExtremeXAndY2[0],
          extremeY = _getExtremeXAndY2[1];

        return React.createElement(
          React.Fragment,
          null,
          renderChildren(edges, visibleVertices, extremeX, extremeY, zoom)
        );
      }
    );
  }

  var visibleVerticesMap = getVisibleVertices();
  var edges = getVisibleEdges();
  var visibleVertices = (0, _toConsumableArray2.default)(
    visibleVerticesMap.values()
  );

  var _getExtremeXAndY3 = getExtremeXAndY(),
    _getExtremeXAndY4 = (0, _slicedToArray2.default)(_getExtremeXAndY3, 2),
    extremeX = _getExtremeXAndY4[0],
    extremeY = _getExtremeXAndY4[1];

  return React.createElement(
    "div",
    {
      style: {
        height: "100%",
        overflow: "auto",
        position: "relative"
      },
      ref: containerRef,
      className: "diagramContainer",
      onScroll: handleScroll,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 262
      }
    },
    renderChildren(edges, visibleVertices, extremeX, extremeY)
  );
};

Diagram.propTypes = {
  vertices: _propTypes.default.arrayOf(
    _propTypes.default.shape({
      id: _propTypes.default.oneOfType([
        _propTypes.default.string,
        _propTypes.default.number
      ]),
      left: _propTypes.default.number,
      top: _propTypes.default.number
    })
  ),
  draggableOptions: _propTypes.default.shape({
    grid: _propTypes.default.arrayOf(_propTypes.default.number),
    consumeStartEvent: _propTypes.default.bool,
    getConstrainingRectangle: _propTypes.default.func,
    containment: _propTypes.default.bool
  }),
  droppableOptions: _propTypes.default.shape({
    canDrop: _propTypes.default.func,
    hoverClass: _propTypes.default.string
  }),
  enableZoom: _propTypes.default.bool,
  renderOverlays: _propTypes.default.func,
  renderBackground: _propTypes.default.func
};
Diagram.defaultProps = {
  edges: [],
  enableZoom: false,
  renderBackground: function renderBackground() {
    return null;
  },
  areVerticesDraggable: true,
  renderOverlays: function renderOverlays() {
    return null;
  }
};
var _default = Diagram;
exports.default = _default;
