"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

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

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _invariant = _interopRequireDefault(require("invariant"));

var _Edges = _interopRequireDefault(require("./Edges"));

var _PanAndZoomContainer = _interopRequireDefault(
  require("./PanAndZoomContainer")
);

var _intervalTree = _interopRequireDefault(require("./lib/intervalTree"));

var _helper = require("./helper");

var _constants = require("./constants");

var _jsxFileName =
  "/Users/ayushmittal/sandbox/react-virtualized-flowchart/src/Diagram.js";

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
        function(edge, verticesMap) {
          var edgeId = edge.id;

          if (_this.xIntervalTreeNodes[edgeId]) {
            return;
          }

          var sourceVertex = verticesMap.get(edge.sourceId);
          (0, _invariant.default)(
            sourceVertex,
            "sourceVertex missing for the edgeId - ".concat(edgeId)
          );
          var targetVertex = verticesMap.get(edge.targetId);
          (0, _invariant.default)(
            targetVertex,
            "targetVertex missing for the edgeId - ".concat(edgeId)
          );
          var interval = (0, _helper.makeXIntervalForEdge)(
            edge,
            sourceVertex.vertex,
            targetVertex.vertex
          );
          _this.xIntervalTreeNodes[edgeId] = interval;

          _this.xIntervalTree.insert(interval);
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "addToYIntervalTree",
        function(edge, verticesMap) {
          var edgeId = edge.id;

          if (_this.yIntervalTreeNodes[edgeId]) {
            return;
          }

          var sourceVertex = verticesMap.get(edge.sourceId);
          (0, _invariant.default)(
            sourceVertex,
            "sourceVertex missing for the edgeId - ".concat(edgeId)
          );
          var targetVertex = verticesMap.get(edge.targetId);
          (0, _invariant.default)(
            targetVertex,
            "targetVertex missing for the edgeId - ".concat(edgeId)
          );
          var interval = (0, _helper.makeYIntervalForEdge)(
            edge,
            sourceVertex.vertex,
            targetVertex.vertex
          );
          _this.yIntervalTreeNodes[edgeId] = interval;

          _this.yIntervalTree.insert(interval);
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "addEdgeToVerticesToEdgesMap",
        function(edge) {
          (0, _helper.addEdge)(_this.verticesToEdgesMap, edge, edge.sourceId);
          (0, _helper.addEdge)(_this.verticesToEdgesMap, edge, edge.targetId);
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "removeEdgeFromVerticesToEdgesMap",
        function(edge) {
          (0, _helper.removeEdge)(
            _this.verticesToEdgesMap,
            edge.id,
            edge.sourceId
          );
          (0, _helper.removeEdge)(
            _this.verticesToEdgesMap,
            edge.id,
            edge.targetId
          );
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
          if (e.target !== e.currentTarget) {
            return;
          }

          _this.updateScroll(e.currentTarget);
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "registerPlumbInstance",
        function(plumbInstance) {
          _this.plumbInstance = plumbInstance;
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
      _this.containerRef = _react.default.createRef();

      var _this$setVertices = _this.setVertices(props.vertices),
        _verticesMap = _this$setVertices.verticesMap;

      _this.initVerticesToEdgesMap(props.edges);

      _this.initIntervalTrees(props.edges, _verticesMap);

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
          var _this2 = this;

          var shouldTriggerRender = false;
          var didVerticesChange = prevProps.vertices !== this.props.vertices;
          var verticesMap = this.verticesMap,
            verticesToEdgesMap = this.verticesToEdgesMap;

          if (didVerticesChange) {
            verticesMap = this.setVertices(this.props.vertices).verticesMap;
          }

          if (this.revalidateNodes) {
            this.verticesToBeValidated.forEach(function(vertex) {
              return _this2.plumbInstance.revalidate(vertex.id);
            });
            this.revalidateNodes = false;
          }

          if (prevProps.edges !== this.props.edges) {
            verticesToEdgesMap = this.updateEdges(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.edges,
                this.props.edges
              ),
              verticesMap
            ).verticesToEdgesMap;
            shouldTriggerRender = true;
          }

          if (didVerticesChange) {
            var _getAddedOrRemovedIte = (0, _helper.getAddedOrRemovedItems)(
                prevProps.vertices,
                this.props.vertices
              ),
              itemsAdded = _getAddedOrRemovedIte.itemsAdded,
              itemsRemoved = _getAddedOrRemovedIte.itemsRemoved;

            this.revalidateNodes = true;
            this.verticesToBeValidated = itemsAdded;
            this.updateIntervalTrees(
              {
                itemsAdded: itemsAdded,
                itemsRemoved: itemsRemoved
              },
              verticesToEdgesMap
            );
            shouldTriggerRender = true;
          }

          if (shouldTriggerRender) {
            this.setState(function(_ref) {
              var version = _ref.version;
              return {
                version: version + 1
              };
            });
          }
        }
      },
      {
        key: "setVertices",
        value: function setVertices(vertices) {
          this.vertices = vertices;
          this.verticesMap = (0, _helper.getVerticesMap)(vertices);
          return {
            vertices: this.vertices,
            verticesMap: this.verticesMap
          };
        }
      },
      {
        key: "initIntervalTrees",
        value: function initIntervalTrees(edges, verticesMap) {
          this.initXIntervalTree(edges, verticesMap);
          this.initYIntervalTree(edges, verticesMap);
        }
      },
      {
        key: "initVerticesToEdgesMap",
        value: function initVerticesToEdgesMap(edges) {
          this.verticesToEdgesMap = edges.reduce(function(vToEMap, edge) {
            (0, _helper.addEdge)(vToEMap, edge, edge.sourceId);
            (0, _helper.addEdge)(vToEMap, edge, edge.targetId);
            return vToEMap;
          }, new Map());
        }
      },
      {
        key: "initXIntervalTree",
        value: function initXIntervalTree(edges, verticesMap) {
          var _this3 = this;

          this.xIntervalTree = (0, _intervalTree.default)();
          this.xIntervalTreeNodes = {};
          edges.forEach(function(edge) {
            return _this3.addToXIntervalTree(edge, verticesMap);
          });
        }
      },
      {
        key: "initYIntervalTree",
        value: function initYIntervalTree(edges, verticesMap) {
          var _this4 = this;

          this.yIntervalTree = (0, _intervalTree.default)();
          this.yIntervalTreeNodes = {};
          edges.forEach(function(edge) {
            return _this4.addToYIntervalTree(edge, verticesMap);
          });
        }
      },
      {
        key: "updateIntervalTrees",
        value: function updateIntervalTrees(_ref2, verticesToEdgesMap) {
          var _this5 = this;

          var itemsAdded = _ref2.itemsAdded,
            itemsRemoved = _ref2.itemsRemoved;
          itemsRemoved.forEach(function(vertex) {
            var vertexId = vertex.id;
            var edges = verticesToEdgesMap.get(vertexId) || [];
            edges.forEach(function(edge) {
              (0,
              _helper.removeNode)(_this5.xIntervalTree, _this5.xIntervalTreeNodes, edge.id);
              (0,
              _helper.removeNode)(_this5.yIntervalTree, _this5.yIntervalTreeNodes, edge.id);
            });
          });
          itemsAdded.forEach(function(vertex) {
            var edges = verticesToEdgesMap.get(vertex.id);
            var verticesMap = _this5.verticesMap;
            edges.forEach(function(edge) {
              _this5.addToXIntervalTree(edge, verticesMap);

              _this5.addToYIntervalTree(edge, verticesMap);
            });
          });
        }
      },
      {
        key: "updateEdges",
        value: function updateEdges(_ref3, verticesMap) {
          var _this6 = this;

          var itemsAdded = _ref3.itemsAdded,
            itemsRemoved = _ref3.itemsRemoved;
          var xIntervalIdToIndex = new Map(
            this.xIntervalTree.intervals.map(function(_ref4, index) {
              var _ref5 = (0, _slicedToArray2.default)(_ref4, 3),
                a = _ref5[0],
                b = _ref5[1],
                edge = _ref5[2];

              return [edge.id, index];
            })
          );
          var xSortedItemsToRemove = (0, _toConsumableArray2.default)(
            itemsRemoved
          ).sort(function(itemA, itemB) {
            return (
              (xIntervalIdToIndex.get(itemA.id) || 0) -
              (xIntervalIdToIndex.get(itemB.id) || 0)
            );
          });
          var yIntervalIdToIndex = new Map(
            this.yIntervalTree.intervals.map(function(_ref6, index) {
              var _ref7 = (0, _slicedToArray2.default)(_ref6, 3),
                a = _ref7[0],
                b = _ref7[1],
                edge = _ref7[2];

              return [edge.id, index];
            })
          );
          var ySortedItemsToRemove = (0, _toConsumableArray2.default)(
            itemsRemoved
          ).sort(function(itemA, itemB) {
            return (
              (yIntervalIdToIndex.get(itemA.id) || 0) -
              (yIntervalIdToIndex.get(itemB.id) || 0)
            );
          });
          itemsRemoved.forEach(function(edge) {
            _this6.removeEdgeFromVerticesToEdgesMap(edge);
          });
          xSortedItemsToRemove.forEach(function(edge) {
            var edgeId = edge.id;
            (0,
            _helper.removeNode)(_this6.xIntervalTree, _this6.xIntervalTreeNodes, edgeId);
          });
          ySortedItemsToRemove.forEach(function(edge) {
            var edgeId = edge.id;
            (0,
            _helper.removeNode)(_this6.yIntervalTree, _this6.yIntervalTreeNodes, edgeId);
          });
          itemsAdded.forEach(function(edge) {
            _this6.addEdgeToVerticesToEdgesMap(edge);

            _this6.addToXIntervalTree(edge, verticesMap);

            _this6.addToYIntervalTree(edge, verticesMap);
          });
          return {
            verticesToEdgesMap: this.verticesToEdgesMap
          };
        }
      },
      {
        key: "getVisibleEdges",
        value: function getVisibleEdges(zoom) {
          var _this$state = this.state,
            scroll = _this$state.scroll,
            version = _this$state.version;

          var _ref8 = this.containerRef.current
              ? this.containerRef.current.getBoundingClientRect()
              : _constants.DEFAULT_CONTAINER_RECT,
            width = _ref8.width,
            height = _ref8.height;

          return (0, _helper.getVisibleEdges)(
            (0, _helper.getViewport)(
              scroll.left,
              scroll.top,
              width,
              height,
              zoom
            ),
            this.xIntervalTree,
            this.yIntervalTree,
            version
          );
        }
      },
      {
        key: "getVisibleVertices",
        value: function getVisibleVertices(zoom) {
          var version = this.state.version;
          return (0, _helper.getVisibleVertices)(
            this.verticesMap,
            this.getVisibleEdges(zoom),
            version
          );
        }
      },
      {
        key: "getExtremeXAndY",
        value: function getExtremeXAndY() {
          var _getExtremeVertices = (0, _helper.getExtremeVertices)(
              this.vertices
            ),
            rightMostVertex = _getExtremeVertices.rightMostVertex,
            bottomMostVertex = _getExtremeVertices.bottomMostVertex;

          var sentinelX =
            (0, _helper.getXUpper)(rightMostVertex) + _constants.MARGIN;

          var sentinelY =
            (0, _helper.getYUpper)(bottomMostVertex) + _constants.MARGIN;

          return [sentinelX, sentinelY];
        }
      },
      {
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
              lineNumber: 313
            }
          });
        }
      },
      {
        key: "renderBackground",
        value: function renderBackground(x, y) {
          return this.props.renderBackground(x, y);
        }
      },
      {
        key: "renderVertices",
        value: function renderVertices(vertices, zoom) {
          var _this7 = this;

          return vertices.map(function(_ref9) {
            var vertex = _ref9.vertex,
              index = _ref9.index;
            return _react.default.createElement(
              _react.default.Fragment,
              {
                key: vertex.id,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 332
                }
              },
              _this7.props.renderVertex({
                vertex: vertex,
                index: index,
                zoom: zoom
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
            renderOverlays: this.props.renderOverlays,
            registerPlumbInstance: this.registerPlumbInstance,
            onAction: this.props.onAction,
            edges: (0, _toConsumableArray2.default)(edgesMap.values()),
            vertices: vertices.map(function(v) {
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
              lineNumber: 344
            }
          });
        }
      },
      {
        key: "renderChildren",
        value: function renderChildren(extremeX, extremeY, zoom) {
          var verticesMap = this.getVisibleVertices(zoom);
          var edges = this.getVisibleEdges(zoom);
          var vertices = (0, _toConsumableArray2.default)(verticesMap.values());
          return _react.default.createElement(
            _react.default.Fragment,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 369
              }
            },
            this.renderVertices(vertices, zoom),
            this.renderEdges(edges, vertices),
            this.renderSentinel(extremeX, extremeY),
            this.renderBackground(extremeX, extremeY)
          );
        }
      },
      {
        key: "render",
        value: function render() {
          var _this8 = this;

          var _this$getExtremeXAndY = this.getExtremeXAndY(),
            _this$getExtremeXAndY2 = (0, _slicedToArray2.default)(
              _this$getExtremeXAndY,
              2
            ),
            extremeX = _this$getExtremeXAndY2[0],
            extremeY = _this$getExtremeXAndY2[1];

          if (this.props.enableZoom) {
            return _react.default.createElement(
              _PanAndZoomContainer.default,
              {
                handleScroll: this.handleScroll,
                containerRef: this.containerRef,
                renderPanAndZoomControls: this.props.renderPanAndZoomControls,
                scroll: this.state.scroll,
                contentSpan: {
                  x: extremeX,
                  y: extremeY
                },
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 383
                }
              },
              function(_ref10) {
                var zoom = _ref10.zoom;
                return _this8.renderChildren(extremeX, extremeY, zoom);
              }
            );
          }

          return _react.default.createElement(
            "div",
            {
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
                lineNumber: 396
              }
            },
            this.renderChildren(extremeX, extremeY, _constants.DEFAULT_ZOOM)
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
