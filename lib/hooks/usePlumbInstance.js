"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(
  require("@babel/runtime/helpers/defineProperty")
);

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var _react = require("react");

var _jsplumb = require("jsplumb");

var _usePrevious = _interopRequireDefault(require("react-use/lib/usePrevious"));

var _helper = require("../helper");

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

var DEFAULT_STATE = {
  overlayEdges: []
};

var usePlumbInstance = function usePlumbInstance(props) {
  var prevVertices = (0, _usePrevious.default)(props.vertices);
  var prevEdges = (0, _usePrevious.default)(props.edges);

  var _useState = (0, _react.useState)(DEFAULT_STATE),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];

  var plumbInstanceRef = (0, _react.useRef)();
  var plumbConnectionsRef = (0, _react.useRef)();
  var plumbInstance = plumbInstanceRef.current;
  var plumbConnections = plumbConnectionsRef.current;

  var addConnectionsAndEndpoints = function addConnectionsAndEndpoints() {
    var addedEdges =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    addedEdges.forEach(function(edge) {
      var sourceId = edge.sourceId,
        targetId = edge.targetId;
      var sourceEndpoint = plumbInstance.addEndpoint(
          sourceId,
          _objectSpread(
            {},
            edge.sourceEndpointStyles || props.sourceEndpointStyles,
            {},
            edge.sourceEndpointOptions || props.sourceEndpointOptions,
            {
              isSource: true
            }
          )
        ),
        targetEndpoint = plumbInstance.addEndpoint(
          targetId,
          _objectSpread(
            {},
            edge.targetEndpointStyles || props.targetEndpointStyles,
            {},
            edge.targetEndpointOptions || props.targetEndpointOptions,
            {
              isTarget: true
            }
          )
        );
      plumbConnections[edge.id] = plumbInstance.connect(
        _objectSpread(
          {},
          edge.styles || props.edgeStyles,
          {},
          edge.options || props.edgeOptions,
          {
            source: sourceEndpoint,
            target: targetEndpoint,
            overlays: (0, _helper.getOverlays)(edge)
          }
        )
      );
    });
  };

  var removeConnectionsAndEndpoints = function removeConnectionsAndEndpoints() {
    var removedEdges =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    removedEdges.forEach(function(edge) {
      var connection = plumbConnections[edge.id];
      var connectionEndpoints = connection.endpoints;
      plumbInstance.deleteConnection(connection);
      plumbInstance.deleteEndpoint(connectionEndpoints[0]);
      plumbInstance.deleteEndpoint(connectionEndpoints[1]);
    });
  };

  var drawConnections = function drawConnections() {
    addConnectionsAndEndpoints(props.edges);
    setState({
      overlayEdges: props.edges
    });
  };

  var handleStop = function handleStop(dragEndEvent) {
    props.onAction({
      type: "ITEM_DRAGGED",
      payload: {
        vertexEl: dragEndEvent.el,
        finalPos: dragEndEvent.finalPos
      }
    });
  };

  var handleDrop = function handleDrop(dropEndEvent) {
    props.onAction({
      type: "ITEM_DROPPED",
      payload: {
        dropEndEvent: dropEndEvent
      }
    });
  };

  var makeVerticesDraggable = function makeVerticesDraggable(vertices) {
    vertices.forEach(function(vertex) {
      plumbInstance.draggable(
        vertex.id,
        _objectSpread({}, props.draggableOptions, {
          stop: handleStop
        })
      );

      if (
        !plumbInstance.getElement(vertex.id).classList.contains("jtk-droppable")
      ) {
        plumbInstance.droppable(
          vertex.id,
          _objectSpread({}, props.droppableOptions, {
            drop: handleDrop
          })
        );
      }
    });
  };

  var updateConnections = function updateConnections(_ref) {
    var itemsAdded = _ref.itemsAdded,
      itemsRemoved = _ref.itemsRemoved;
    removeConnectionsAndEndpoints(itemsRemoved);
    addConnectionsAndEndpoints(itemsAdded);
    setState({
      overlayEdges: props.edges
    });
  };

  var unmanageVertices = function unmanageVertices(
    verticesRemoved,
    verticesUpdated
  ) {
    verticesRemoved.map(function(vertex) {
      plumbInstance.unmanage(vertex.id);
    });
    verticesUpdated.map(function(vertex) {
      plumbInstance.destroyDraggable(vertex.id);
    });
  };

  var updateVertices = function updateVertices(_ref2) {
    var itemsAdded = _ref2.itemsAdded,
      itemsRemoved = _ref2.itemsRemoved,
      itemsUpdated = _ref2.itemsUpdated;
    unmanageVertices(itemsRemoved, itemsUpdated);

    if (props.areVerticesDraggable) {
      makeVerticesDraggable(itemsAdded);
    } else {
      /*
       * plumbInstance.draggable manages vertices internally
       * Since we cannot make a vertex draggable here, so added the following code to manage them
       **/
      itemsAdded.map(function(vertex) {
        plumbInstance.manage(vertex.id, plumbInstance.getElement(vertex.id));
      });
    }
    /*
     * plumbInstance.manage utility doesn't recalculate the offsets
     * Whenever an element is updated forcefully from external changes, we need to recalculate
     **/

    itemsAdded.map(function(vertex) {
      plumbInstance.updateOffset({
        elId: vertex.id,
        recalc: true
      });
    });
  };

  (0, _react.useEffect)(function() {
    _jsplumb.jsPlumb.ready(function() {
      plumbInstanceRef.current = _jsplumb.jsPlumb.getInstance(
        props.containerEl
      );
      props.plumbInstanceRef.current = plumbInstance;
      plumbConnectionsRef.current = {};
      drawConnections();

      if (props.areVerticesDraggable) {
        makeVerticesDraggable(props.vertices);
      }
    });
  }, []);
  (0, _react.useEffect)(function() {
    if (prevVertices && prevVertices !== props.vertices) {
      updateVertices(
        (0, _helper.getAddedOrRemovedItems)(prevVertices, props.vertices)
      );
    }

    if (prevEdges && prevEdges !== props.edges) {
      updateConnections(
        (0, _helper.getAddedOrRemovedItems)(prevEdges, props.edges)
      );
    }
  });
  return {
    overlayEdges: state.overlayEdges
  };
};

var _default = usePlumbInstance;
exports.default = _default;
