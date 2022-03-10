"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var React = _interopRequireWildcard(require("react"));

var _jsplumb = require("jsplumb");

var _usePrevious = _interopRequireDefault(require("react-use/lib/usePrevious"));

var _helper = require("../helper");

var _constants = require("../constants");

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

var usePlumbInstance = function usePlumbInstance(props) {
  var prevVertices = (0, _usePrevious.default)(props.vertices);
  var prevEdges = (0, _usePrevious.default)(props.edges);

  var _useState = (0, React.useState)(_constants.PLUMB_INSTANCE_INITIAL_STATE),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];

  var plumbInstanceRef = (0, React.useRef)();
  var plumbConnectionsRef = (0, React.useRef)();
  var sourceEndpointStyles = props.sourceEndpointStyles,
    sourceEndpointOptions = props.sourceEndpointOptions,
    targetEndpointStyles = props.targetEndpointStyles,
    targetEndpointOptions = props.targetEndpointOptions,
    edgeStyles = props.edgeStyles,
    edgeOptions = props.edgeOptions,
    draggableOptions = props.draggableOptions,
    droppableOptions = props.droppableOptions,
    areVerticesDraggable = props.areVerticesDraggable,
    onAction = props.onAction;
  var addConnectionsAndEndpoints = (0, React.useCallback)(
    function() {
      var addedEdges =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      addedEdges.forEach(function(edge) {
        var sourceId = edge.sourceId,
          targetId = edge.targetId;
        var sourceEndpoint = plumbInstanceRef.current.addEndpoint(
            sourceId,
            _objectSpread(
              {},
              edge.sourceEndpointStyles || sourceEndpointStyles,
              {},
              edge.sourceEndpointOptions || sourceEndpointOptions,
              {
                isSource: true
              }
            )
          ),
          targetEndpoint = plumbInstanceRef.current.addEndpoint(
            targetId,
            _objectSpread(
              {},
              edge.targetEndpointStyles || targetEndpointStyles,
              {},
              edge.targetEndpointOptions || targetEndpointOptions,
              {
                isTarget: true
              }
            )
          );
        plumbConnectionsRef.current[edge.id] = plumbInstanceRef.current.connect(
          _objectSpread(
            {},
            edge.styles || edgeStyles,
            {},
            edge.options || edgeOptions,
            {
              source: sourceEndpoint,
              target: targetEndpoint,
              overlays: (0, _helper.getOverlays)(edge)
            }
          )
        );
      });
    },
    [
      sourceEndpointStyles,
      sourceEndpointOptions,
      targetEndpointStyles,
      targetEndpointOptions,
      edgeStyles,
      edgeOptions
    ]
  );
  var removeConnectionsAndEndpoints = (0, React.useCallback)(function() {
    var removedEdges =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    removedEdges.forEach(function(edge) {
      var connection = plumbConnectionsRef.current[edge.id];
      var connectionEndpoints = connection.endpoints;
      plumbInstanceRef.current.deleteConnection(connection);
      plumbInstanceRef.current.deleteEndpoint(connectionEndpoints[0]);
      plumbInstanceRef.current.deleteEndpoint(connectionEndpoints[1]);
    });
  }, []);
  var drawConnections = (0, React.useCallback)(
    function() {
      addConnectionsAndEndpoints(props.edges);
      setState({
        overlayEdges: props.edges
      });
    },
    [addConnectionsAndEndpoints, setState, props.edges]
  );
  var handleStop = (0, React.useCallback)(
    function(dragEndEvent) {
      onAction({
        type: "ITEM_DRAGGED",
        payload: {
          vertexEl: dragEndEvent.el,
          finalPos: dragEndEvent.finalPos
        }
      });
    },
    [onAction]
  );
  var handleDrop = (0, React.useCallback)(
    function(dropEndEvent) {
      onAction({
        type: "ITEM_DROPPED",
        payload: {
          dropEndEvent: dropEndEvent
        }
      });
    },
    [onAction]
  );
  var makeVerticesDraggable = (0, React.useCallback)(
    function(vertices) {
      vertices.forEach(function(vertex) {
        plumbInstanceRef.current.draggable(
          vertex.id,
          _objectSpread({}, draggableOptions, {
            stop: handleStop
          })
        );

        if (
          !plumbInstanceRef.current
            .getElement(vertex.id)
            .classList.contains("jtk-droppable")
        ) {
          plumbInstanceRef.current.droppable(
            vertex.id,
            _objectSpread({}, droppableOptions, {
              drop: handleDrop
            })
          );
        }
      });
    },
    [draggableOptions, droppableOptions, handleStop, handleDrop]
  );
  var updateConnections = (0, React.useCallback)(
    function(_ref) {
      var itemsAdded = _ref.itemsAdded,
        itemsRemoved = _ref.itemsRemoved;
      removeConnectionsAndEndpoints(itemsRemoved);
      addConnectionsAndEndpoints(itemsAdded);
      setState({
        overlayEdges: props.edges
      });
    },
    [
      removeConnectionsAndEndpoints,
      addConnectionsAndEndpoints,
      setState,
      props.edges
    ]
  );
  var unmanageVertices = (0, React.useCallback)(function(
    verticesRemoved,
    verticesUpdated
  ) {
    verticesRemoved.map(function(vertex) {
      plumbInstanceRef.current.unmanage(vertex.id);
    });
    verticesUpdated.map(function(vertex) {
      plumbInstanceRef.current.destroyDraggable(vertex.id);
    });
  },
  []);
  var updateVertices = (0, React.useCallback)(
    function(_ref2) {
      var itemsAdded = _ref2.itemsAdded,
        itemsRemoved = _ref2.itemsRemoved,
        itemsUpdated = _ref2.itemsUpdated;
      unmanageVertices(itemsRemoved, itemsUpdated);

      if (areVerticesDraggable) {
        makeVerticesDraggable(itemsAdded);
      } else {
        /*
         * plumbInstance.draggable manages vertices internally
         * Since we cannot make a vertex draggable here, so added the following code to manage them
         **/
        itemsAdded.map(function(vertex) {
          plumbInstanceRef.current.manage(
            vertex.id,
            plumbInstanceRef.current.getElement(vertex.id)
          );
        });
      }
      /*
       * plumbInstance.manage utility doesn't recalculate the offsets
       * Whenever an element is updated forcefully from external changes, we need to recalculate
       **/

      itemsAdded.map(function(vertex) {
        plumbInstanceRef.current.updateOffset({
          elId: vertex.id,
          recalc: true
        });
      });
    },
    [unmanageVertices, areVerticesDraggable, makeVerticesDraggable]
  );
  (0, React.useEffect)(function() {
    _jsplumb.jsPlumb.ready(function() {
      plumbInstanceRef.current = _jsplumb.jsPlumb.getInstance(
        props.containerEl
      );
      props.plumbInstanceRef.current = plumbInstanceRef.current;
      plumbConnectionsRef.current = {};
      drawConnections();

      if (areVerticesDraggable) {
        makeVerticesDraggable(props.vertices);
      }
    });
  }, []);
  (0, React.useLayoutEffect)(function() {
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
