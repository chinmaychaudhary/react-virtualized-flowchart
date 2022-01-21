"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _assertThisInitialized2 = _interopRequireDefault(
  require("@babel/runtime/helpers/assertThisInitialized")
);

var _inherits2 = _interopRequireDefault(
  require("@babel/runtime/helpers/inherits")
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require("@babel/runtime/helpers/possibleConstructorReturn")
);

var _getPrototypeOf2 = _interopRequireDefault(
  require("@babel/runtime/helpers/getPrototypeOf")
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
  "/Users/milap/spr-repo/react-virtualized-flowchart/src/Edges.js";

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(
    nodeInterop
  ) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })),
      keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? ownKeys(Object(source), !0).forEach(function(key) {
          (0, _defineProperty2.default)(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source)
        )
      : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
          );
        });
  }
  return target;
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2.default)(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2.default)(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2.default)(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function() {})
    );
    return true;
  } catch (e) {
    return false;
  }
}

var Edges = /*#__PURE__*/ (function(_PureComponent) {
  (0, _inherits2.default)(Edges, _PureComponent);

  var _super = _createSuper(Edges);

  function Edges() {
    var _this;

    (0, _classCallCheck2.default)(this, Edges);

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
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
                _objectSpread(
                  _objectSpread(
                    {},
                    edge.sourceEndpointStyles ||
                      _this.props.sourceEndpointStyles
                  ),
                  edge.sourceEndpointOptions ||
                    _this.props.sourceEndpointOptions
                ),
                {},
                {
                  isSource: true
                }
              )
            ),
            targetEndpoint = _this.plumbInstance.addEndpoint(
              targetId,
              _objectSpread(
                _objectSpread(
                  _objectSpread(
                    {},
                    edge.targetEndpointStyles ||
                      _this.props.targetEndpointStyles
                  ),
                  edge.targetEndpointOptions ||
                    _this.props.targetEndpointOptions
                ),
                {},
                {
                  isTarget: true
                }
              )
            );

          _this.plumbConnections[edge.id] = _this.plumbInstance.connect(
            _objectSpread(
              _objectSpread(
                _objectSpread({}, edge.styles || _this.props.edgeStyles),
                edge.options || _this.props.edgeOptions
              ),
              {},
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
            _objectSpread(
              _objectSpread({}, _this4.props.draggableOptions),
              {},
              {
                stop: _this4.handleStop
              }
            )
          );

          if (
            !_this4.plumbInstance
              .getElement(vertex.id)
              .classList.contains("jtk-droppable")
          ) {
            _this4.plumbInstance.droppable(
              vertex.id,
              _objectSpread(
                _objectSpread({}, _this4.props.droppableOptions),
                {},
                {
                  drop: _this4.handleDrop
                }
              )
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
          /*
           * plumbInstance.draggable manages vertices internally
           * Since we cannot make a vertex draggable here, so added the following code to manage them
           **/
          itemsAdded.map(function(vertex) {
            _this5.plumbInstance.manage(
              vertex.id,
              _this5.plumbInstance.getElement(vertex.id)
            );
          });
        }
        /*
         * plumbInstance.manage utility doesn't recalculate the offsets
         * Whenever an element is updated forcefully from external changes, we need to recalculate
         **/

        itemsAdded.map(function(vertex) {
          _this5.plumbInstance.updateOffset({
            elId: vertex.id,
            recalc: true
          });
        });
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
        return /*#__PURE__*/ _react.default.createElement(_Overlays.default, {
          edges: this.state.overlayEdges,
          renderOverlays: this.props.renderOverlays,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 160
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
