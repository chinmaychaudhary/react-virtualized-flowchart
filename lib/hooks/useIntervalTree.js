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

var _react = require("react");

var _invariant = _interopRequireDefault(require("invariant"));

var _useFirstMountState = _interopRequireDefault(
  require("react-use/lib/useFirstMountState")
);

var _intervalTree = _interopRequireDefault(require("../lib/intervalTree"));

var makeXIntervalForEdge = function makeXIntervalForEdge(edge, v1, v2) {
  var x1 = Math.min(v1.left, v2.left) || 0;
  var x2 = Math.max(
    (v1.left || 0) + (v1.width || 0),
    (v2.left || 0) + (v2.width || 0)
  );
  return [x1, x2, edge];
};

var makeYIntervalForEdge = function makeYIntervalForEdge(edge, v1, v2) {
  var y1 = Math.min(v1.top, v2.top) || 0;
  var y2 = Math.max(
    (v1.top || 0) + (v1.height || 0),
    (v2.top || 0) + (v2.height || 0)
  );
  return [y1, y2, edge];
};

var removeNode = function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }

  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
};

var removeEdge = function removeEdge(vToEMap, edgeId, vertexId) {
  var sourceVertexEdgeList = vToEMap.get(vertexId);

  if (sourceVertexEdgeList) {
    sourceVertexEdgeList = sourceVertexEdgeList.filter(function(presentEdge) {
      return presentEdge.id !== edgeId;
    });
  }

  if (!sourceVertexEdgeList || !sourceVertexEdgeList.length) {
    vToEMap.delete(vertexId);
  } else {
    vToEMap.set(vertexId, sourceVertexEdgeList);
  }
};

var addEdge = function addEdge(vToEMap, edge, vertexId) {
  var sourceVertexEdgeList = vToEMap.get(vertexId);

  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
};

var useIntervalTree = function useIntervalTree(edges, verticesMap) {
  var isFirstMount = (0, _useFirstMountState.default)();
  var xIntervalTreeRef = (0, _react.useRef)((0, _intervalTree.default)());
  var xIntervalTreeNodesRef = (0, _react.useRef)({});
  var yIntervalTreeRef = (0, _react.useRef)((0, _intervalTree.default)());
  var yIntervalTreeNodesRef = (0, _react.useRef)({});

  var addToXIntervalTree = function addToXIntervalTree(edge, verticesMap) {
    var edgeId = edge.id;

    if (xIntervalTreeNodesRef.current[edgeId]) {
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
    var interval = makeXIntervalForEdge(
      edge,
      sourceVertex.vertex,
      targetVertex.vertex
    );
    xIntervalTreeNodesRef.current[edgeId] = interval;
    xIntervalTreeRef.current.insert(interval);
  };

  var addToYIntervalTree = function addToYIntervalTree(edge, verticesMap) {
    var edgeId = edge.id;

    if (yIntervalTreeNodesRef.current[edgeId]) {
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
    var interval = makeYIntervalForEdge(
      edge,
      sourceVertex.vertex,
      targetVertex.vertex
    );
    yIntervalTreeNodesRef.current[edgeId] = interval;
    yIntervalTreeRef.current.insert(interval);
  };

  if (isFirstMount) {
    edges.forEach(function(edge) {
      return addToXIntervalTree(edge, verticesMap);
    });
    edges.forEach(function(edge) {
      return addToYIntervalTree(edge, verticesMap);
    });
  }

  var updateIntervalTrees = function updateIntervalTrees(
    _ref,
    verticesMap,
    verticesToEdgesMap
  ) {
    var itemsAdded = _ref.itemsAdded,
      itemsRemoved = _ref.itemsRemoved;
    itemsRemoved.forEach(function(vertex) {
      var vertexId = vertex.id;
      var edges = verticesToEdgesMap.get(vertexId) || [];
      edges.forEach(function(edge) {
        removeNode(
          xIntervalTreeRef.current,
          xIntervalTreeNodesRef.current,
          edge.id
        );
        removeNode(
          yIntervalTreeRef.current,
          yIntervalTreeNodesRef.current,
          edge.id
        );
      });
    });
    itemsAdded.forEach(function(vertex) {
      var edges = verticesToEdgesMap.get(vertex.id);
      edges.forEach(function(edge) {
        addToXIntervalTree(edge, verticesMap);
        addToYIntervalTree(edge, verticesMap);
      });
    });
  };

  var addEdgeToVerticesToEdgesMap = function addEdgeToVerticesToEdgesMap(
    edge,
    verticesToEdgesMap
  ) {
    addEdge(verticesToEdgesMap, edge, edge.sourceId);
    addEdge(verticesToEdgesMap, edge, edge.targetId);
  };

  var removeEdgeFromVerticesToEdgesMap = function removeEdgeFromVerticesToEdgesMap(
    edge,
    verticesToEdgesMap
  ) {
    removeEdge(verticesToEdgesMap, edge.id, edge.sourceId);
    removeEdge(verticesToEdgesMap, edge.id, edge.targetId);
  };

  var updateEdges = function updateEdges(
    _ref2,
    verticesMap,
    verticesToEdgesMap
  ) {
    var itemsAdded = _ref2.itemsAdded,
      itemsRemoved = _ref2.itemsRemoved;
    var xIntervalIdToIndex = new Map(
      xIntervalTreeRef.current.intervals.map(function(_ref3, index) {
        var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
          a = _ref4[0],
          b = _ref4[1],
          edge = _ref4[2];

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
      yIntervalTreeRef.current.intervals.map(function(_ref5, index) {
        var _ref6 = (0, _slicedToArray2.default)(_ref5, 3),
          a = _ref6[0],
          b = _ref6[1],
          edge = _ref6[2];

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
      removeEdgeFromVerticesToEdgesMap(edge, verticesToEdgesMap);
    });
    xSortedItemsToRemove.forEach(function(edge) {
      var edgeId = edge.id;
      removeNode(
        xIntervalTreeRef.current,
        xIntervalTreeNodesRef.current,
        edgeId
      );
    });
    ySortedItemsToRemove.forEach(function(edge) {
      var edgeId = edge.id;
      removeNode(
        yIntervalTreeRef.current,
        yIntervalTreeNodesRef.current,
        edgeId
      );
    });
    itemsAdded.forEach(function(edge) {
      addEdgeToVerticesToEdgesMap(edge, verticesToEdgesMap);
      addToXIntervalTree(edge, verticesMap);
      addToYIntervalTree(edge, verticesMap);
    });
    return {
      verticesToEdgesMap: verticesToEdgesMap
    };
  };

  return {
    xIntervalTree: xIntervalTreeRef.current,
    yIntervalTree: yIntervalTreeRef.current,
    updateIntervalTrees: updateIntervalTrees,
    updateEdges: updateEdges
  };
};

var _default = useIntervalTree;
exports.default = _default;
