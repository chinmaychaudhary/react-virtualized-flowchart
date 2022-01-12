"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _invariant = _interopRequireDefault(require("invariant"));

var _intervalTree = _interopRequireDefault(require("./lib/intervalTree"));

var _Edges = _interopRequireDefault(require("./Edges"));

var _helper = require("./helper");

var _jsxFileName = "/Users/chicho17/react-learn/react-virtualized-flowchart/src/Diagram.js";
var MARGIN = 100;

function getXUpper(vertex) {
  return (vertex.left || 0) + (vertex.width || 0);
}

function getYUpper(vertex) {
  return (vertex.top || 0) + (vertex.height || 0);
}

var getExtremeVertices = (0, _memoizeOne.default)(function (vertices) {
  return vertices.reduce(function (res, vertex) {
    if (getXUpper(res.rightMostVertex) < getXUpper(vertex)) {
      res.rightMostVertex = vertex;
    }

    if (getYUpper(res.bottomMostVertex) < getYUpper(vertex)) {
      res.bottomMostVertex = vertex;
    }

    return res;
  }, {
    rightMostVertex: {
      left: -1,
      width: 0
    },
    bottomMostVertex: {
      top: -1,
      height: 0
    }
  });
});

function getVerticesMap(vertices) {
  return new Map(vertices.map(function (v, index) {
    return [v.id, {
      vertex: v,
      index: index
    }];
  }));
}

var _getVisibleVertices = (0, _memoizeOne.default)(function (universalVerticesMap, visibleEdgesMap, version) {
  var visibleVertices = new Map();
  visibleEdgesMap.forEach(function (edge) {
    visibleVertices.set(edge.sourceId, universalVerticesMap.get(edge.sourceId));
    visibleVertices.set(edge.targetId, universalVerticesMap.get(edge.targetId));
  });
  return visibleVertices;
});

var _getVisibleEdges = (0, _memoizeOne.default)(function (viewport, xIntervalTree, yIntervalTree, version) {
  var xEdgesMap = new Map();
  var yEdgesMap = new Map();
  var visibleVertices = new Map();
  xIntervalTree.queryInterval(viewport.xMin, viewport.xMax, function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 3),
        low = _ref2[0],
        high = _ref2[1],
        edge = _ref2[2];

    xEdgesMap.set(edge.id, edge);
  });
  yIntervalTree.queryInterval(viewport.yMin, viewport.yMax, function (_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
        low = _ref4[0],
        high = _ref4[1],
        edge = _ref4[2];

    yEdgesMap.set(edge.id, edge);
  });
  xEdgesMap.forEach(function (edge, edgeId) {
    if (yEdgesMap.has(edgeId)) {
      visibleVertices.set(edgeId, edge);
    }
  });
  return visibleVertices;
});

function addEdge(vToEMap, edge, vertexId) {
  var sourceVertexEdgeList = vToEMap.get(vertexId);

  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
}

function removeEdge(vToEMap, edgeId, vertexId) {
  var sourceVertexEdgeList = vToEMap.get(vertexId);

  if (sourceVertexEdgeList) {
    sourceVertexEdgeList = sourceVertexEdgeList.filter(function (presentEdge) {
      return presentEdge.id !== edgeId;
    });
  }

  if (!sourceVertexEdgeList || !sourceVertexEdgeList.length) {
    vToEMap.delete(vertexId);
  } else {
    vToEMap.set(vertexId, sourceVertexEdgeList);
  }
}

var getViewport = (0, _memoizeOne.default)(function (scrollLeft, scrollTop, clientWidth, clientHeight) {
  return {
    xMin: scrollLeft,
    xMax: scrollLeft + clientWidth,
    yMin: scrollTop,
    yMax: scrollTop + clientHeight
  };
});

function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }

  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
}

function makeXIntervalForEdge(edge, v1, v2) {
  var x1 = Math.min(v1.left, v2.left) || 0;
  var x2 = Math.max((v1.left || 0) + (v1.width || 0), (v2.left || 0) + (v2.width || 0));
  return [x1, x2, edge];
}

function makeYIntervalForEdge(edge, v1, v2) {
  var y1 = Math.min(v1.top, v2.top) || 0;
  var y2 = Math.max((v1.top || 0) + (v1.height || 0), (v2.top || 0) + (v2.height || 0));
  return [y1, y2, edge];
}

var Diagram =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2.default)(Diagram, _React$PureComponent);

  function Diagram(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Diagram);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Diagram).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addToXIntervalTree", function (edge, verticesMap) {
      var edgeId = edge.id;

      if (_this.xIntervalTreeNodes[edgeId]) {
        return;
      }

      var sourceVertex = verticesMap.get(edge.sourceId);
      (0, _invariant.default)(sourceVertex, "sourceVertex missing for the edgeId - ".concat(edgeId));
      var targetVertex = verticesMap.get(edge.targetId);
      (0, _invariant.default)(targetVertex, "targetVertex missing for the edgeId - ".concat(edgeId));
      var interval = makeXIntervalForEdge(edge, sourceVertex.vertex, targetVertex.vertex);
      _this.xIntervalTreeNodes[edgeId] = interval;

      _this.xIntervalTree.insert(interval);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addToYIntervalTree", function (edge, verticesMap) {
      var edgeId = edge.id;

      if (_this.yIntervalTreeNodes[edgeId]) {
        return;
      }

      var sourceVertex = verticesMap.get(edge.sourceId);
      (0, _invariant.default)(sourceVertex, "sourceVertex missing for the edgeId - ".concat(edgeId));
      var targetVertex = verticesMap.get(edge.targetId);
      (0, _invariant.default)(targetVertex, "targetVertex missing for the edgeId - ".concat(edgeId));
      var interval = makeYIntervalForEdge(edge, sourceVertex.vertex, targetVertex.vertex);
      _this.yIntervalTreeNodes[edgeId] = interval;

      _this.yIntervalTree.insert(interval);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addEdgeToVerticesToEdgesMap", function (edge) {
      addEdge(_this.verticesToEdgesMap, edge, edge.sourceId);
      addEdge(_this.verticesToEdgesMap, edge, edge.targetId);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "removeEdgeFromVerticesToEdgesMap", function (edge) {
      removeEdge(_this.verticesToEdgesMap, edge.id, edge.sourceId);
      removeEdge(_this.verticesToEdgesMap, edge.id, edge.targetId);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateScroll", (0, _throttle2.default)(function (target) {
      _this.setState({
        scroll: {
          left: target.scrollLeft,
          top: target.scrollTop
        }
      });
    }, 0));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleScroll", function (e) {
      if (e.target !== e.currentTarget) {
        return;
      }

      _this.updateScroll(e.currentTarget);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "registerPlumbInstance", function (plumbInstance) {
      _this.plumbInstance = plumbInstance;
    });
    _this.state = {
      scroll: {
        left: 0,
        top: 0
      },
      container: {
        height: 0,
        width: 0
      },
      version: 0,
      isContainerElReady: false
    };
    _this.containerRef = _react.default.createRef();

    var _this$setVertices = _this.setVertices(props.vertices),
        _verticesMap = _this$setVertices.verticesMap;

    _this.initVerticesToEdgesMap(props.edges);

    _this.initIntervalTrees(props.edges, _verticesMap);

    return _this;
  }

  (0, _createClass2.default)(Diagram, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$containerRef$cu = this.containerRef.current.getBoundingClientRect(),
          height = _this$containerRef$cu.height,
          width = _this$containerRef$cu.width;

      this.setState({
        container: {
          height: height,
          width: width
        },
        isContainerElReady: true
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      var _this2 = this;

      var shouldTriggerRender = false;
      var didVerticesChange = prevProps.vertices !== this.props.vertices;
      var verticesMap = this.verticesMap,
          verticesToEdgesMap = this.verticesToEdgesMap;

      if (didVerticesChange) {
        verticesMap = this.setVertices(this.props.vertices).verticesMap;
      }

      if (this.revalidateNodes) {
        this.verticesToBeValidated.forEach(function (vertex) {
          return _this2.plumbInstance.revalidate(vertex.id);
        });
        this.revalidateNodes = false;
      }

      if (prevProps.edges !== this.props.edges) {
        verticesToEdgesMap = this.updateEdges((0, _helper.getAddedOrRemovedItems)(prevProps.edges, this.props.edges), verticesMap).verticesToEdgesMap;
        shouldTriggerRender = true;
      }

      if (didVerticesChange) {
        var _getAddedOrRemovedIte = (0, _helper.getAddedOrRemovedItems)(prevProps.vertices, this.props.vertices),
            itemsAdded = _getAddedOrRemovedIte.itemsAdded,
            itemsRemoved = _getAddedOrRemovedIte.itemsRemoved;

        this.revalidateNodes = true;
        this.verticesToBeValidated = itemsAdded;
        this.updateIntervalTrees({
          itemsAdded: itemsAdded,
          itemsRemoved: itemsRemoved
        }, verticesToEdgesMap);
        shouldTriggerRender = true;
      }

      if (shouldTriggerRender) {
        this.setState(function (_ref5) {
          var version = _ref5.version;
          return {
            version: version + 1
          };
        });
      }
    }
  }, {
    key: "setVertices",
    value: function setVertices(vertices) {
      this.vertices = vertices;
      this.verticesMap = getVerticesMap(vertices);
      return {
        vertices: this.vertices,
        verticesMap: this.verticesMap
      };
    }
  }, {
    key: "initIntervalTrees",
    value: function initIntervalTrees(edges, verticesMap) {
      this.initXIntervalTree(edges, verticesMap);
      this.initYIntervalTree(edges, verticesMap);
    }
  }, {
    key: "initVerticesToEdgesMap",
    value: function initVerticesToEdgesMap(edges) {
      this.verticesToEdgesMap = edges.reduce(function (vToEMap, edge) {
        addEdge(vToEMap, edge, edge.sourceId);
        addEdge(vToEMap, edge, edge.targetId);
        return vToEMap;
      }, new Map());
    }
  }, {
    key: "initXIntervalTree",
    value: function initXIntervalTree(edges, verticesMap) {
      var _this3 = this;

      this.xIntervalTree = (0, _intervalTree.default)();
      this.xIntervalTreeNodes = {};
      edges.forEach(function (edge) {
        return _this3.addToXIntervalTree(edge, verticesMap);
      });
    }
  }, {
    key: "initYIntervalTree",
    value: function initYIntervalTree(edges, verticesMap) {
      var _this4 = this;

      this.yIntervalTree = (0, _intervalTree.default)();
      this.yIntervalTreeNodes = {};
      edges.forEach(function (edge) {
        return _this4.addToYIntervalTree(edge, verticesMap);
      });
    }
  }, {
    key: "updateIntervalTrees",
    value: function updateIntervalTrees(_ref6, verticesToEdgesMap) {
      var _this5 = this;

      var itemsAdded = _ref6.itemsAdded,
          itemsRemoved = _ref6.itemsRemoved;
      itemsRemoved.forEach(function (vertex) {
        var vertexId = vertex.id;
        var edges = verticesToEdgesMap.get(vertexId) || [];
        edges.forEach(function (edge) {
          removeNode(_this5.xIntervalTree, _this5.xIntervalTreeNodes, edge.id);
          removeNode(_this5.yIntervalTree, _this5.yIntervalTreeNodes, edge.id);
        });
      });
      itemsAdded.forEach(function (vertex) {
        var edges = verticesToEdgesMap.get(vertex.id);
        var verticesMap = _this5.verticesMap;
        edges.forEach(function (edge) {
          _this5.addToXIntervalTree(edge, verticesMap);

          _this5.addToYIntervalTree(edge, verticesMap);
        });
      });
    }
  }, {
    key: "updateEdges",
    value: function updateEdges(_ref7, verticesMap) {
      var _this6 = this;

      var itemsAdded = _ref7.itemsAdded,
          itemsRemoved = _ref7.itemsRemoved;
      var xIntervalIdToIndex = new Map(this.xIntervalTree.intervals.map(function (_ref8, index) {
        var _ref9 = (0, _slicedToArray2.default)(_ref8, 3),
            a = _ref9[0],
            b = _ref9[1],
            edge = _ref9[2];

        return [edge.id, index];
      }));
      var xSortedItemsToRemove = (0, _toConsumableArray2.default)(itemsRemoved).sort(function (itemA, itemB) {
        return (xIntervalIdToIndex.get(itemA.id) || 0) - (xIntervalIdToIndex.get(itemB.id) || 0);
      });
      var yIntervalIdToIndex = new Map(this.yIntervalTree.intervals.map(function (_ref10, index) {
        var _ref11 = (0, _slicedToArray2.default)(_ref10, 3),
            a = _ref11[0],
            b = _ref11[1],
            edge = _ref11[2];

        return [edge.id, index];
      }));
      var ySortedItemsToRemove = (0, _toConsumableArray2.default)(itemsRemoved).sort(function (itemA, itemB) {
        return (yIntervalIdToIndex.get(itemA.id) || 0) - (yIntervalIdToIndex.get(itemB.id) || 0);
      });
      itemsRemoved.forEach(function (edge) {
        _this6.removeEdgeFromVerticesToEdgesMap(edge);
      });
      xSortedItemsToRemove.forEach(function (edge) {
        var edgeId = edge.id;
        removeNode(_this6.xIntervalTree, _this6.xIntervalTreeNodes, edgeId);
      });
      ySortedItemsToRemove.forEach(function (edge) {
        var edgeId = edge.id;
        removeNode(_this6.yIntervalTree, _this6.yIntervalTreeNodes, edgeId);
      });
      itemsAdded.forEach(function (edge) {
        _this6.addEdgeToVerticesToEdgesMap(edge);

        _this6.addToXIntervalTree(edge, verticesMap);

        _this6.addToYIntervalTree(edge, verticesMap);
      });
      return {
        verticesToEdgesMap: this.verticesToEdgesMap
      };
    }
  }, {
    key: "getVisibleEdges",
    value: function getVisibleEdges() {
      var _this$state = this.state,
          scroll = _this$state.scroll,
          container = _this$state.container,
          version = _this$state.version;
      return _getVisibleEdges(getViewport(scroll.left, scroll.top, container.width, container.height), this.xIntervalTree, this.yIntervalTree, version);
    }
  }, {
    key: "getVisibleVertices",
    value: function getVisibleVertices() {
      var version = this.state.version;
      return _getVisibleVertices(this.verticesMap, this.getVisibleEdges(), version);
    }
  }, {
    key: "getExtremeXAndY",
    value: function getExtremeXAndY() {
      var _getExtremeVertices = getExtremeVertices(this.vertices),
          rightMostVertex = _getExtremeVertices.rightMostVertex,
          bottomMostVertex = _getExtremeVertices.bottomMostVertex;

      var sentinelX = getXUpper(rightMostVertex) + MARGIN;
      var sentinelY = getYUpper(bottomMostVertex) + MARGIN;
      return [sentinelX, sentinelY];
    }
  }, {
    key: "renderSentinel",
    value: function renderSentinel(x, y) {
      return _react.default.createElement("div", {
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
          lineNumber: 433
        }
      });
    }
  }, {
    key: "renderBackground",
    value: function renderBackground(x, y) {
      return this.props.renderBackground(x, y);
    }
  }, {
    key: "renderVertices",
    value: function renderVertices(vertices) {
      var _this7 = this;

      return vertices.map(function (_ref12) {
        var vertex = _ref12.vertex,
            index = _ref12.index;
        return _react.default.createElement(_react.default.Fragment, {
          key: vertex.id,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 452
          }
        }, _this7.props.renderVertex({
          vertex: vertex,
          index: index
        }));
      });
    }
  }, {
    key: "renderEdges",
    value: function renderEdges(edgesMap, vertices) {
      if (!this.state.isContainerElReady) {
        return null;
      }

      return _react.default.createElement(_Edges.default, {
        renderOverlays: this.props.renderOverlays,
        registerPlumbInstance: this.registerPlumbInstance,
        onAction: this.props.onAction,
        edges: (0, _toConsumableArray2.default)(edgesMap.values()),
        vertices: vertices.map(function (v) {
          return v.vertex;
        }),
        containerEl: this.containerRef.current,
        sourceEndpointStyles: this.props.sourceEndpointStyles,
        sourceEndpointOptions: this.props.sourceEndpointOptions,
        targetEndpointStyles: this.props.targetEndpointStyles,
        targetEndpointOptions: this.props.targetEndpointOptions,
        edgeStyles: this.props.edgeStyles,
        draggableOptions: this.props.draggableOptions,
        droppableOptions: this.props.droppableOptions,
        areVerticesDraggable: this.props.areVerticesDraggable,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 464
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var visibleVerticesMap = this.getVisibleVertices();
      var edges = this.getVisibleEdges();
      var vertices = (0, _toConsumableArray2.default)(visibleVerticesMap.values());

      var _this$getExtremeXAndY = this.getExtremeXAndY(),
          _this$getExtremeXAndY2 = (0, _slicedToArray2.default)(_this$getExtremeXAndY, 2),
          extremeX = _this$getExtremeXAndY2[0],
          extremeY = _this$getExtremeXAndY2[1];

      return _react.default.createElement("div", {
        style: {
          height: "100%",
          overflow: "auto",
          position: "relative"
        },
        ref: this.containerRef,
        className: "diagramContainer",
        onScroll: this.handleScroll,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 491
        }
      }, this.renderVertices(vertices), this.renderEdges(edges, vertices), this.renderSentinel(extremeX, extremeY), this.renderBackground(extremeX, extremeY));
    }
  }]);
  return Diagram;
}(_react.default.PureComponent);

Diagram.propTypes = {
  vertices: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    left: _propTypes.default.number,
    top: _propTypes.default.number
  })),
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
  renderOverlays: _propTypes.default.func,
  renderBackground: _propTypes.default.func
};
Diagram.defaultProps = {
  edges: [],
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