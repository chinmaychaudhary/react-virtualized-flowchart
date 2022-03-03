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

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _merge2 = _interopRequireDefault(require("lodash/merge"));

var _usePrevious = _interopRequireDefault(require("react-use/lib/usePrevious"));

var _Edges = _interopRequireDefault(require("./Edges"));

var _PanAndZoomContainer = _interopRequireDefault(
  require("./PanAndZoomContainer")
);

var _helper = require("./helper");

var _useIntervalTree2 = _interopRequireDefault(
  require("./hooks/useIntervalTree")
);

var _useEdgesAndVertices2 = _interopRequireDefault(
  require("./hooks/useEdgesAndVertices")
);

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

var MARGIN = 100;
var DEFAULT_CONTAINER_RECT = {
  width: 0,
  height: 0
};
var DEFAULT_STATE = {
  scroll: {
    left: 0,
    top: 0
  },
  version: 0,
  isContainerElReady: false
};

var getXUpper = function getXUpper(vertex) {
  return (vertex.left || 0) + (vertex.width || 0);
};

var getYUpper = function getYUpper(vertex) {
  return (vertex.top || 0) + (vertex.height || 0);
};

var getExtremeVertices = (0, _memoizeOne.default)(function(vertices) {
  return vertices.reduce(
    function(res, vertex) {
      if (getXUpper(res.rightMostVertex) < getXUpper(vertex)) {
        res.rightMostVertex = vertex;
      }

      if (getYUpper(res.bottomMostVertex) < getYUpper(vertex)) {
        res.bottomMostVertex = vertex;
      }

      return res;
    },
    {
      rightMostVertex: {
        left: -1,
        width: 0
      },
      bottomMostVertex: {
        top: -1,
        height: 0
      }
    }
  );
});
var getVisibleVerticesHelper = (0, _memoizeOne.default)(function(
  universalVerticesMap,
  visibleEdgesMap,
  version
) {
  var visibleVertices = new Map();
  visibleEdgesMap.forEach(function(edge) {
    visibleVertices.set(edge.sourceId, universalVerticesMap.get(edge.sourceId));
    visibleVertices.set(edge.targetId, universalVerticesMap.get(edge.targetId));
  });
  return visibleVertices;
});
var getVisibleEdgesHelper = (0, _memoizeOne.default)(function(
  viewport,
  xIntervalTree,
  yIntervalTree,
  version
) {
  var xEdgesMap = new Map();
  var yEdgesMap = new Map();
  var visibleVertices = new Map();
  xIntervalTree.queryInterval(viewport.xMin, viewport.xMax, function(_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 3),
      low = _ref2[0],
      high = _ref2[1],
      edge = _ref2[2];

    xEdgesMap.set(edge.id, edge);
  });
  yIntervalTree.queryInterval(viewport.yMin, viewport.yMax, function(_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
      low = _ref4[0],
      high = _ref4[1],
      edge = _ref4[2];

    yEdgesMap.set(edge.id, edge);
  });
  xEdgesMap.forEach(function(edge, edgeId) {
    if (yEdgesMap.has(edgeId)) {
      visibleVertices.set(edgeId, edge);
    }
  });
  return visibleVertices;
});
var getViewport = (0, _memoizeOne.default)(function(
  scrollLeft,
  scrollTop,
  clientWidth,
  clientHeight
) {
  return {
    xMin: scrollLeft,
    xMax: scrollLeft + clientWidth,
    yMin: scrollTop,
    yMax: scrollTop + clientHeight
  };
});

var Diagram = function Diagram(props) {
  var prevEdges = (0, _usePrevious.default)(props.edges);
  var prevVertices = (0, _usePrevious.default)(props.vertices);

  var _useState = (0, React.useState)(DEFAULT_STATE),
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

  var verticesMap = verticesMapRef.current;
  var verticesToEdgesMap = verticesToEdgesMapRef.current;

  var _useIntervalTree = (0, _useIntervalTree2.default)(
      props.edges,
      verticesMap
    ),
    xIntervalTree = _useIntervalTree.xIntervalTree,
    yIntervalTree = _useIntervalTree.yIntervalTree,
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
        verticesMap,
        verticesToEdgesMap
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
        verticesMap,
        verticesToEdgesMap
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
  var updateScroll = (0, _throttle2.default)(function(target) {
    setState(function(prevState) {
      return _objectSpread({}, prevState, {
        scroll: {
          left: target.scrollLeft,
          top: target.scrollTop
        }
      });
    });
  }, 0);

  var handleScroll = function handleScroll(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    updateScroll(e.currentTarget);
  };

  var getVisibleEdges = function getVisibleEdges() {
    var scroll = state.scroll,
      version = state.version;

    var _ref5 =
        containerRef.current?.getBoundingClientRect() ?? DEFAULT_CONTAINER_RECT,
      width = _ref5.width,
      height = _ref5.height;

    var scale = 1 / (props.zoom || 1);
    var scrollLeft = scroll.left * scale;
    var scrollTop = scroll.top * scale;
    var containerWidth = width * scale;
    var containerHeight = height * scale;
    return getVisibleEdgesHelper(
      getViewport(scrollLeft, scrollTop, containerWidth, containerHeight),
      xIntervalTree,
      yIntervalTree,
      version
    );
  };

  var getVisibleVertices = function getVisibleVertices() {
    var version = state.version;
    return getVisibleVerticesHelper(verticesMap, getVisibleEdges(), version);
  };

  var getExtremeXAndY = function getExtremeXAndY() {
    var _getExtremeVertices = getExtremeVertices(vertices),
      rightMostVertex = _getExtremeVertices.rightMostVertex,
      bottomMostVertex = _getExtremeVertices.bottomMostVertex;

    var sentinelX = getXUpper(rightMostVertex) + MARGIN;
    var sentinelY = getYUpper(bottomMostVertex) + MARGIN;
    return [sentinelX, sentinelY];
  };

  var renderSentinel = function renderSentinel(x, y) {
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
        lineNumber: 250
      }
    });
  };

  var renderBackground = function renderBackground(x, y) {
    return props.renderBackground(x, y);
  };

  var renderVertices = function renderVertices(vertices) {
    return vertices.map(function(_ref6) {
      var vertex = _ref6.vertex,
        index = _ref6.index;
      return React.createElement(
        React.Fragment,
        {
          key: vertex.id,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 269
          }
        },
        props.renderVertex({
          vertex: vertex,
          index: index
        })
      );
    });
  };

  var renderEdges = function renderEdges(edgesMap, vertices) {
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
        lineNumber: 281
      }
    });
  };

  var renderChildren = function renderChildren(
    edges,
    vertices,
    extremeX,
    extremeY
  ) {
    return React.createElement(
      React.Fragment,
      null,
      renderVertices(vertices),
      renderEdges(edges, vertices),
      renderSentinel(extremeX, extremeY),
      renderBackground(extremeX, extremeY)
    );
  };

  var visibleVerticesMap = getVisibleVertices();
  var edges = getVisibleEdges();
  var visibleVertices = (0, _toConsumableArray2.default)(
    visibleVerticesMap.values()
  );

  var _getExtremeXAndY = getExtremeXAndY(),
    _getExtremeXAndY2 = (0, _slicedToArray2.default)(_getExtremeXAndY, 2),
    extremeX = _getExtremeXAndY2[0],
    extremeY = _getExtremeXAndY2[1];

  var mergedStyles = (0, _merge2.default)(
    {
      height: "100%",
      overflow: "auto",
      position: "relative"
    },
    props.diagramContainerStyles
  );

  if (props.enableZoom) {
    return React.createElement(
      _PanAndZoomContainer.default,
      {
        handleScroll: handleScroll,
        containerRef: containerRef,
        renderPanAndZoomControls: props.renderPanAndZoomControls,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 324
        }
      },
      function(_ref7) {
        var transform = _ref7.transform;
        return React.createElement(
          "div",
          {
            style: {
              transform: transform
            },
            className: "diagramContainer",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 330
            }
          },
          renderChildren(edges, visibleVertices, extremeX, extremeY)
        );
      }
    );
  }

  return React.createElement(
    "div",
    {
      style: mergedStyles,
      ref: containerRef,
      className: "diagramContainer",
      onScroll: handleScroll,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 339
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
