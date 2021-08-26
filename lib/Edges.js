"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var _getPrototypeOf3 = _interopRequireDefault(
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

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _jsplumb = require("jsplumb");

var _Overlays = _interopRequireDefault(require("./Overlays"));

var _helper = require("./helper");

var _jsxFileName =
  "/Users/chicho17/try/react-virtualized-flowchart/src/Edges.js";

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

var Edges =
  /*#__PURE__*/
  (function(_PureComponent) {
    (0, _inherits2.default)(Edges, _PureComponent);

    function Edges() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2.default)(this, Edges);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2.default)(
        this,
        (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Edges)).call.apply(
          _getPrototypeOf2,
          [this].concat(args)
        )
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "state",
        {
          overlayEdges: []
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "handleStop",
        function(dragEndEvent) {
          _this.props.onAction({
            type: "ITEM_DRAGGED",
            payload: {
              vertexEl: dragEndEvent.el,
              finalPos: dragEndEvent.finalPos
            }
          });
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "handleDrop",
        function(dropEndEvent) {
          _this.props.onAction({
            type: "ITEM_DROPPED",
            payload: {
              dropEndEvent: dropEndEvent
            }
          });
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "removeConnectionsAndEndpoints",
        function() {
          var removedEdges =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : [];
          removedEdges.forEach(function(edge) {
            var connection = _this.plumbConnections[edge.id];
            var connectionEndpoints = connection.endpoints;

            _this.plumbInstance.deleteConnection(connection);

            _this.plumbInstance.deleteEndpoint(connectionEndpoints[0]);

            _this.plumbInstance.deleteEndpoint(connectionEndpoints[1]);
          });
        }
      );
      (0, _defineProperty2.default)(
        (0, _assertThisInitialized2.default)(_this),
        "addConnectionsAndEndpoints",
        function() {
          var addedEdges =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : [];
          addedEdges.forEach(function(edge) {
            var sourceId = edge.sourceId,
              targetId = edge.targetId;

            var sourceEndpoint = _this.plumbInstance.addEndpoint(
                sourceId,
                _objectSpread(
                  {},
                  edge.sourceEndpointStyles || _this.props.sourceEndpointStyles,
                  {},
                  edge.sourceEndpointOptions ||
                    _this.props.sourceEndpointOptions,
                  {
                    isSource: true
                  }
                )
              ),
              targetEndpoint = _this.plumbInstance.addEndpoint(
                targetId,
                _objectSpread(
                  {},
                  edge.targetEndpointStyles || _this.props.targetEndpointStyles,
                  {},
                  edge.targetEndpointOptions ||
                    _this.props.targetEndpointOptions,
                  {
                    isTarget: true
                  }
                )
              );

            _this.plumbConnections[edge.id] = _this.plumbInstance.connect(
              _objectSpread(
                {},
                edge.styles || _this.props.edgeStyles,
                {},
                edge.options || _this.props.edgeOptions,
                {
                  source: sourceEndpoint,
                  target: targetEndpoint,
                  overlays: (0, _helper.getOverlays)(edge)
                }
              )
            );
          });
        }
      );
      return _this;
    }

    (0, _createClass2.default)(Edges, [
      {
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          _jsplumb.jsPlumb.ready(function() {
            _this2.plumbInstance = _jsplumb.jsPlumb.getInstance(
              _this2.props.containerEl
            );

            _this2.props.registerPlumbInstance(_this2.plumbInstance);

            _this2.plumbConnections = {};

            _this2.drawConnections();

            if (_this2.props.areVerticesDraggable) {
              _this2.makeVerticesDraggable(_this2.props.vertices);
            }
          });
        }
      },
      {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          if (prevProps.vertices !== this.props.vertices) {
            this.updateVertices(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.vertices,
                this.props.vertices
              )
            );
          }

          if (prevProps.edges !== this.props.edges) {
            this.updateConnections(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.edges,
                this.props.edges
              )
            );
          }
        }
      },
      {
        key: "unmanageVertices",
        value: function unmanageVertices(verticesRemoved, verticesUpdated) {
          var _this3 = this;

          verticesRemoved.map(function(vertex) {
            _this3.plumbInstance.unmanage(vertex.id);
          });
          verticesUpdated.map(function(vertex) {
            _this3.plumbInstance.destroyDraggable(vertex.id);
          });
        }
      },
      {
        key: "makeVerticesDraggable",
        value: function makeVerticesDraggable(vertices) {
          var _this4 = this;

          vertices.forEach(function(vertex) {
            _this4.plumbInstance.draggable(
              vertex.id,
              _objectSpread({}, _this4.props.draggableOptions, {
                stop: _this4.handleStop
              })
            );

            if (
              !_this4.plumbInstance
                .getElement(vertex.id)
                .classList.contains("jtk-droppable")
            ) {
              _this4.plumbInstance.droppable(
                vertex.id,
                _objectSpread({}, _this4.props.droppableOptions, {
                  drop: _this4.handleDrop
                })
              );
            }
          });
        }
      },
      {
        key: "updateConnections",
        value: function updateConnections(_ref) {
          var itemsAdded = _ref.itemsAdded,
            itemsRemoved = _ref.itemsRemoved;
          this.removeConnectionsAndEndpoints(itemsRemoved);
          this.addConnectionsAndEndpoints(itemsAdded);
          this.setState({
            overlayEdges: this.props.edges
          });
        }
      },
      {
        key: "updateVertices",
        value: function updateVertices(_ref2) {
          var _this5 = this;

          var itemsAdded = _ref2.itemsAdded,
            itemsRemoved = _ref2.itemsRemoved,
            itemsUpdated = _ref2.itemsUpdated;
          this.unmanageVertices(itemsRemoved, itemsUpdated);

          if (this.props.areVerticesDraggable) {
            this.makeVerticesDraggable(itemsAdded);
          } else {
            itemsAdded.map(function(vertex) {
              _this5.plumbInstance.manage(
                vertex.id,
                _this5.plumbInstance.getElement(vertex.id)
              );
            });
          }
        }
      },
      {
        key: "drawConnections",
        value: function drawConnections() {
          this.addConnectionsAndEndpoints(this.props.edges);
          this.setState({
            overlayEdges: this.props.edges
          });
        }
      },
      {
        key: "render",
        value: function render() {
          return _react.default.createElement(_Overlays.default, {
            edges: this.state.overlayEdges,
            renderOverlays: this.props.renderOverlays,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 148
            }
          });
        }
      }
    ]);
    return Edges;
  })(_react.PureComponent);

Edges.displayName = "Edges";
Edges.propTypes = {
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
  renderOverlays: _propTypes.default.func
};
Edges.defaultProps = {
  sourceEndpointStyles: {
    paintStyle: {
      radius: 1
    },
    connectorPaintStyle: {
      stroke: "blue",
      strokeWidth: 0
    }
  },
  sourceEndpointOptions: {
    anchor: "Bottom"
  },
  targetEndpointStyles: {
    paintStyle: {
      fill: "blue",
      radius: 1
    },
    connectorPaintStyle: {
      stroke: "blue",
      strokeWidth: 0
    }
  },
  targetEndpointOptions: {
    anchor: "Top"
  },
  edgeStyles: {
    paintStyle: {
      stroke: "black"
    },
    connector: [
      "Flowchart",
      {
        curviness: 0,
        cornerRadius: 20
      }
    ]
  }
};
var _default = Edges;
exports.default = _default;
