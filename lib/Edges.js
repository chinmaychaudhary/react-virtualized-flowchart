"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectSpread")
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

var _jsplumb = require("jsplumb");

var _helper = require("./helper");

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
        "removeConnectionsAndEndpoints",
        function() {
          var removedConnections =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : [];
          removedConnections
            .map(function(connection) {
              return _this.plumbConnections[connection.id];
            })
            .forEach(function(connection) {
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
            var sourceEndpoint = _this.plumbInstance.addEndpoint(
                edge.sourceId,
                (0, _objectSpread2.default)(
                  {},
                  edge.sourceEndpointStyles || _this.props.sourceEndpointStyles,
                  edge.sourceEndpointOptions ||
                    _this.props.sourceEndpointOptions,
                  {
                    isSource: true
                  }
                )
              ),
              targetEndpoint = _this.plumbInstance.addEndpoint(
                edge.targetId,
                (0, _objectSpread2.default)(
                  {},
                  edge.targetEndpointStyles || _this.props.targetEndpointStyles,
                  edge.targetEndpointOptions ||
                    _this.props.targetEndpointOptions,
                  {
                    isTarget: true
                  }
                )
              );

            _this.plumbConnections[edge.id] = _this.plumbInstance.connect(
              (0, _objectSpread2.default)(
                {},
                edge.styles || _this.props.edgeStyles,
                edge.options || _this.props.edgeOptions,
                {
                  source: sourceEndpoint,
                  target: targetEndpoint,
                  overlays: [
                    [
                      "Label",
                      {
                        label: edge.name
                      }
                    ]
                  ]
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
            _this2.plumbConnections = {};

            _this2.drawConnections();

            _this2.makeVerticesDraggable(_this2.props.vertices);
          });
        }
      },
      {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          if (prevProps.edges !== this.props.edges) {
            this.updateConnections(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.edges,
                this.props.edges
              )
            );
          }

          if (prevProps.vertices !== this.props.vertices) {
            this.updateVertices(
              (0, _helper.getAddedOrRemovedItems)(
                prevProps.vertices,
                this.props.vertices
              )
            );
          }
        }
      },
      {
        key: "makeVerticesDraggable",
        value: function makeVerticesDraggable(vertices) {
          var _this3 = this;

          vertices.map(function(vertex) {
            _this3.plumbInstance.draggable(vertex.id, {
              stop: _this3.handleStop
            });
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
        }
      },
      {
        key: "updateVertices",
        value: function updateVertices(_ref2) {
          var itemsAdded = _ref2.itemsAdded,
            itemsRemoved = _ref2.itemsRemoved;
          this.makeVerticesDraggable(itemsAdded);
        }
      },
      {
        key: "drawConnections",
        value: function drawConnections() {
          this.addConnectionsAndEndpoints(this.props.edges);
        }
      },
      {
        key: "render",
        value: function render() {
          return null;
        }
      }
    ]);
    return Edges;
  })(_react.PureComponent);

Edges.displayName = "Edges";
Edges.propTypes = {};
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
