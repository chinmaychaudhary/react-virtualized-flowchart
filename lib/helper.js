"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeEdgeFromVerticesToEdgesMap = exports.addEdgeToVerticesToEdgesMap = exports.removeNode = exports.makeYIntervalForEdge = exports.makeXIntervalForEdge = exports.initVerticesToEdgesMap = exports.removeEdge = exports.addEdge = exports.getVerticesMap = exports.getViewport = exports.getVisibleVerticesHelper = exports.getExtremeVertices = exports.getYUpper = exports.getXUpper = exports.getOverlays = exports.getOverlayId = exports.getAddedOrRemovedItems = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _map2 = _interopRequireDefault(require("lodash/map"));

var getAddedOrRemovedItems = function getAddedOrRemovedItems(
  prevItems,
  nextItems
) {
  var prevMap = new Map(
    prevItems.map(function(i) {
      return [i.id, i];
    })
  );
  var nextMap = new Map(
    nextItems.map(function(i) {
      return [i.id, i];
    })
  );
  var itemsAdded = [];
  var itemsRemoved = [];
  var itemsUpdated = [];
  prevMap.forEach(function(value, id) {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });
  nextMap.forEach(function(value, id) {
    if (!prevMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
      itemsAdded.push(value);
    }
  });
  return {
    itemsAdded: itemsAdded,
    itemsRemoved: itemsRemoved,
    itemsUpdated: itemsUpdated
  };
};

exports.getAddedOrRemovedItems = getAddedOrRemovedItems;

var getOverlayId = function getOverlayId(edge, overlay) {
  var sourceId = edge.sourceId,
    targetId = edge.targetId;
  return ""
    .concat(sourceId, "-")
    .concat(targetId, "-")
    .concat(overlay.id);
};

exports.getOverlayId = getOverlayId;

var getOverlays = function getOverlays(edge) {
  var customOverlays = (0, _map2.default)(edge.customOverlays, function(
    customOverlay
  ) {
    var id = customOverlay.id,
      location = customOverlay.location;
    return [
      "Custom",
      {
        create: function create() {
          var overlayDiv = document.createElement("div");
          overlayDiv.setAttribute("id", getOverlayId(edge, customOverlay));
          return overlayDiv;
        },
        location: location,
        id: id
      }
    ];
  });
  return [].concat(
    (0, _toConsumableArray2.default)(edge.overlays || []),
    (0, _toConsumableArray2.default)(customOverlays)
  );
};

exports.getOverlays = getOverlays;

var getXUpper = function getXUpper(vertex) {
  return (vertex.left || 0) + (vertex.width || 0);
};

exports.getXUpper = getXUpper;

var getYUpper = function getYUpper(vertex) {
  return (vertex.top || 0) + (vertex.height || 0);
};

exports.getYUpper = getYUpper;

var getExtremeVertices = function getExtremeVertices(vertices) {
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
};

exports.getExtremeVertices = getExtremeVertices;

var getVisibleVerticesHelper = function getVisibleVerticesHelper(
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
};

exports.getVisibleVerticesHelper = getVisibleVerticesHelper;

var getViewport = function getViewport(
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
};

exports.getViewport = getViewport;

var getVerticesMap = function getVerticesMap(vertices) {
  return new Map(
    vertices.map(function(v, index) {
      return [
        v.id,
        {
          vertex: v,
          index: index
        }
      ];
    })
  );
};

exports.getVerticesMap = getVerticesMap;

var addEdge = function addEdge(vToEMap, edge, vertexId) {
  var sourceVertexEdgeList = vToEMap.get(vertexId);

  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
};

exports.addEdge = addEdge;

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

exports.removeEdge = removeEdge;

var initVerticesToEdgesMap = function initVerticesToEdgesMap(edges) {
  return edges.reduce(function(vToEMap, edge) {
    addEdge(vToEMap, edge, edge.sourceId);
    addEdge(vToEMap, edge, edge.targetId);
    return vToEMap;
  }, new Map());
};

exports.initVerticesToEdgesMap = initVerticesToEdgesMap;

var makeXIntervalForEdge = function makeXIntervalForEdge(edge, v1, v2) {
  var x1 = Math.min(v1.left, v2.left) || 0;
  var x2 = Math.max(
    (v1.left || 0) + (v1.width || 0),
    (v2.left || 0) + (v2.width || 0)
  );
  return [x1, x2, edge];
};

exports.makeXIntervalForEdge = makeXIntervalForEdge;

var makeYIntervalForEdge = function makeYIntervalForEdge(edge, v1, v2) {
  var y1 = Math.min(v1.top, v2.top) || 0;
  var y2 = Math.max(
    (v1.top || 0) + (v1.height || 0),
    (v2.top || 0) + (v2.height || 0)
  );
  return [y1, y2, edge];
};

exports.makeYIntervalForEdge = makeYIntervalForEdge;

var removeNode = function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }

  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
};

exports.removeNode = removeNode;

var addEdgeToVerticesToEdgesMap = function addEdgeToVerticesToEdgesMap(
  edge,
  verticesToEdgesMap
) {
  addEdge(verticesToEdgesMap, edge, edge.sourceId);
  addEdge(verticesToEdgesMap, edge, edge.targetId);
};

exports.addEdgeToVerticesToEdgesMap = addEdgeToVerticesToEdgesMap;

var removeEdgeFromVerticesToEdgesMap = function removeEdgeFromVerticesToEdgesMap(
  edge,
  verticesToEdgesMap
) {
  removeEdge(verticesToEdgesMap, edge.id, edge.sourceId);
  removeEdge(verticesToEdgesMap, edge.id, edge.targetId);
};

exports.removeEdgeFromVerticesToEdgesMap = removeEdgeFromVerticesToEdgesMap;
