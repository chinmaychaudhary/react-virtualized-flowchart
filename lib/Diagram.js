"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require("@babel/runtime/helpers/classCallCheck")
);

var _createClass2 = _interopRequireDefault(
  require("@babel/runtime/helpers/createClass")
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require("@babel/runtime/helpers/possibleConstructorReturn")
);

var _getPrototypeOf2 = _interopRequireDefault(
  require("@babel/runtime/helpers/getPrototypeOf")
);

var _assertThisInitialized2 = _interopRequireDefault(
  require("@babel/runtime/helpers/assertThisInitialized")
);

var _inherits2 = _interopRequireDefault(
  require("@babel/runtime/helpers/inherits")
);

var _defineProperty2 = _interopRequireDefault(
  require("@babel/runtime/helpers/defineProperty")
);

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _intervalTree = _interopRequireDefault(require("./lib/intervalTree"));

var _Edges = _interopRequireDefault(require("./Edges"));

var _helper = require("./helper");

var _jsxFileName =
  "/Users/chicho17/try/react-virtualized-flowchart/src/Diagram.js";
var MARGIN = 100;
var getExtremeVertices = (0, _memoizeOne.default)(function(vertices) {
  return vertices.reduce(
    function(res, vertex) {
      if (res.rightMostVertex.left < vertex.left) {
        res.rightMostVertex = vertex;
      }

      if (res.bottomMostVertex.top < vertex.top) {
        res.bottomMostVertex = vertex;
      }

      return res;
    },
    {
      rightMostVertex: {
        left: -1
      },
      bottomMostVertex: {
        top: -1
      }
    }
  );
});

var _getVisibleVertices = (0, _memoizeOne.default)(function(
  vertices,
  viewport,
  xIntervalTree,
  yIntervalTree,
  version
) {
  var universalVerticesMap = new Map(
    vertices.map(function(v) {
      return [v.id, v];
    })
  );
  var xVerticesMap = new Map();
  var yVerticesMap = new Map();
  var visibleVertices = new Map();
  xIntervalTree.queryInterval(viewport.xMin, viewport.xMax, function(_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 3),
      low = _ref2[0],
      high = _ref2[1],
      vertexId = _ref2[2];

    xVerticesMap.set(vertexId, universalVerticesMap.get(vertexId));
  });
  yIntervalTree.queryInterval(viewport.yMin, viewport.yMax, function(_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
      low = _ref4[0],
      high = _ref4[1],
      vertexId = _ref4[2];

    yVerticesMap.set(vertexId, universalVerticesMap.get(vertexId));
  });
  xVerticesMap.forEach(function(vertex, id) {
    if (yVerticesMap.has(id)) {
      visibleVertices.set(id, vertex);
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

function getRelevantEdgesAndMissedVertices(
  visibleVerticesMap,
  vToEMap,
  vertices
) {
  var universalVerticesMap = new Map(
    vertices.map(function(v) {
      return [v.id, v];
    })
  );
  return (0, _toConsumableArray2.default)(visibleVerticesMap.values()).reduce(
    function(res, vertex) {
      var vEdgeList = vToEMap.get(vertex.id) || [];
      vEdgeList.forEach(function(edge) {
        res.edges.set(edge.id, edge);

        if (!visibleVerticesMap.has(edge.sourceId)) {
          res.missedVertices.set(
            edge.sourceId,
            universalVerticesMap.get(edge.sourceId)
          );
        }

        if (!visibleVerticesMap.has(edge.targetId)) {
          res.missedVertices.set(
            edge.targetId,
            universalVerticesMap.get(edge.targetId)
          );
        }
      });
      return res;
    },
    {
      edges: new Map(),
      missedVertices: new Map()
    }
  );
}

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

function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
}

var Diagram =
  /*#__PURE__*/
  (function(_React$PureComponent) {
    (0, _inherits2.default)(Diagram, _React$PureComponent);

    function Diagram(props) {
      var _this;

      (0, _classCallCheck2.default)(this, Diagram);
      _this = (0, _possibleConstructorReturn2.default)(
        this,
        (0, _getPrototypeOf2.default)(Diagram).call(this, props)
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "addToXIntervalTree",
        function(vertex) {
          var interval = [vertex.left, vertex.left + vertex.width, vertex.id];
          _this.xIntervalTreeNodes[vertex.id] = interval;

          _this.xIntervalTree.insert(interval);
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "addToYIntervalTree",
        function(vertex) {
          var interval = [vertex.top, vertex.top + vertex.height, vertex.id];
          _this.yIntervalTreeNodes[vertex.id] = interval;

          _this.yIntervalTree.insert(interval);
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "updateScroll",
        (0, _throttle2.default)(function(target) {
          _this.setState({
            scroll: {
              left: target.scrollLeft,
              top: target.scrollTop
            }
          });
        }, 0)
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "handleScroll",
        function(e) {
          _this.updateScroll(e.target);
        }
      );
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
      _this.vertices = props.vertices;
      _this.containerRef = _react.default.createRef();

      _this.initIntervalTrees();

      _this.initVerticesToEdgesMap(props.vertices, props.edges);

      return _this;
    }

    (0, _createClass2.default)(Diagram, [
      {
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
      },
      {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
          if (prevProps.vertices !== this.props.vertices) {
            this.vertices = this.props.vertices;
            this.updateIntervalTrees(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.vertices,
                this.props.vertices
              )
            );
            this.setState(function(_ref5) {
              var version = _ref5.version;
              return {
                version: version + 1
              };
            });
          }

          if (prevProps.edges !== this.props.edges) {
            this.updateEdges(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.edges,
                this.props.edges
              )
            );
            this.setState(function(_ref6) {
              var version = _ref6.version;
              return {
                version: version + 1
              };
            });
          }
        }
      },
      {
        key: "initIntervalTrees",
        value: function initIntervalTrees() {
          this.initXIntervalTree(this.props.vertices);
          this.initYIntervalTree(this.props.vertices);
        }
      },
      {
        key: "initXIntervalTree",
        value: function initXIntervalTree(vertices) {
          this.xIntervalTree = (0, _intervalTree.default)();
          this.xIntervalTreeNodes = {};
          vertices.forEach(this.addToXIntervalTree);
        }
      },
      {
        key: "initYIntervalTree",
        value: function initYIntervalTree(vertices) {
          this.yIntervalTree = (0, _intervalTree.default)();
          this.yIntervalTreeNodes = {};
          vertices.forEach(this.addToYIntervalTree);
        }
      },
      {
        key: "initVerticesToEdgesMap",
        value: function initVerticesToEdgesMap(vertices, edges) {
          this.verticesToEdgesMap = edges.reduce(function(vToEMap, edge) {
            addEdge(vToEMap, edge, edge.sourceId);
            addEdge(vToEMap, edge, edge.targetId);
            return vToEMap;
          }, new Map());
        }
      },
      {
        key: "updateIntervalTrees",
        value: function updateIntervalTrees(_ref7) {
          var _this2 = this;

          var itemsAdded = _ref7.itemsAdded,
            itemsRemoved = _ref7.itemsRemoved;
          itemsRemoved.forEach(function(vertex) {
            var vertexId = vertex.id;
            removeNode(
              _this2.xIntervalTree,
              _this2.xIntervalTreeNodes,
              vertexId
            );
            removeNode(
              _this2.yIntervalTree,
              _this2.yIntervalTreeNodes,
              vertexId
            );
          });
          itemsAdded.forEach(function(vertex) {
            _this2.addToXIntervalTree(vertex);

            _this2.addToYIntervalTree(vertex);
          });
        }
      },
      {
        key: "updateEdges",
        value: function updateEdges(_ref8) {
          var _this3 = this;

          var itemsAdded = _ref8.itemsAdded,
            itemsRemoved = _ref8.itemsRemoved;
          itemsRemoved.forEach(function(edge) {
            _this3.verticesToEdgesMap.delete(edge.sourceId);

            _this3.verticesToEdgesMap.delete(edge.targetId);
          });
          itemsAdded.forEach(function(edge) {
            addEdge(_this3.verticesToEdgesMap, edge, edge.sourceId);
            addEdge(_this3.verticesToEdgesMap, edge, edge.targetId);
          });
        }
      },
      {
        key: "getVisibleVertices",
        value: function getVisibleVertices() {
          var _this$state = this.state,
            scroll = _this$state.scroll,
            container = _this$state.container,
            version = _this$state.version;
          return _getVisibleVertices(
            this.vertices,
            getViewport(
              scroll.left,
              scroll.top,
              container.width,
              container.height
            ),
            this.xIntervalTree,
            this.yIntervalTree,
            version
          );
        }
      },
      {
        key: "renderSentinel",
        value: function renderSentinel() {
          var _getExtremeVertices = getExtremeVertices(this.vertices),
            rightMostVertex = _getExtremeVertices.rightMostVertex,
            bottomMostVertex = _getExtremeVertices.bottomMostVertex;

          var sentinelX = rightMostVertex.left + rightMostVertex.width + MARGIN;
          var sentinelY =
            bottomMostVertex.top + bottomMostVertex.width + MARGIN;
          return _react.default.createElement("div", {
            style: {
              height: 1,
              width: 1,
              position: "absolute",
              left: 0,
              top: 0,
              transform: "translate3d("
                .concat(sentinelX, "px, ")
                .concat(sentinelY, "px, 0)")
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 255
            }
          });
        }
      },
      {
        key: "renderVertices",
        value: function renderVertices(vertices) {
          var _this4 = this;

          return vertices.map(function(vertex, index) {
            return _react.default.createElement(
              _react.default.Fragment,
              {
                key: vertex.id,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 270
                }
              },
              _this4.props.renderVertex({
                vertex: vertex,
                index: index
              })
            );
          });
        }
      },
      {
        key: "renderEdges",
        value: function renderEdges(edgesMap, vertices) {
          if (!this.state.isContainerElReady) {
            return null;
          }

          return _react.default.createElement(_Edges.default, {
            onAction: this.props.onAction,
            edges: (0, _toConsumableArray2.default)(edgesMap.values()),
            vertices: vertices,
            containerEl: this.containerRef.current,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 282
            }
          });
        }
      },
      {
        key: "render",
        value: function render() {
          var visibleVerticesMap = this.getVisibleVertices();

          var _getRelevantEdgesAndM = getRelevantEdgesAndMissedVertices(
              visibleVerticesMap,
              this.verticesToEdgesMap,
              this.vertices
            ),
            edges = _getRelevantEdgesAndM.edges,
            missedVertices = _getRelevantEdgesAndM.missedVertices;

          var vertices = [].concat(
            (0, _toConsumableArray2.default)(visibleVerticesMap.values()),
            (0, _toConsumableArray2.default)(missedVertices.values())
          );
          return _react.default.createElement(
            "div",
            {
              ref: this.containerRef,
              className: "diagramContainer full-height",
              onScroll: this.handleScroll,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 304
              }
            },
            this.renderVertices(vertices),
            this.renderEdges(edges, vertices),
            this.renderSentinel()
          );
        }
      }
    ]);
    return Diagram;
  })(_react.default.PureComponent);

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
  )
};
Diagram.defaultProps = {
  edges: []
};
var _default = Diagram;
exports.default = _default;
