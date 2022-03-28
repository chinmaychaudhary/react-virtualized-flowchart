"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAddedOrRemovedItems = getAddedOrRemovedItems;
exports.getOverlayId = getOverlayId;
exports.getOverlays = getOverlays;
exports.getXUpper = getXUpper;
exports.getYUpper = getYUpper;
exports.getVerticesMap = getVerticesMap;
exports.addEdge = addEdge;
exports.removeEdge = removeEdge;
exports.removeNode = removeNode;
exports.makeXIntervalForEdge = makeXIntervalForEdge;
exports.makeYIntervalForEdge = makeYIntervalForEdge;
exports.getContainerScroll = exports.getTranslate3DCoordinates = exports.getViewport = exports.getVisibleEdges = exports.getVisibleVertices = exports.getExtremeVertices = void 0;

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _map2 = _interopRequireDefault(require("lodash/map"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

function getAddedOrRemovedItems(prevItems, nextItems) {
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
}

function getOverlayId(edge, overlay) {
  var sourceId = edge.sourceId,
    targetId = edge.targetId;
  return ""
    .concat(sourceId, "-")
    .concat(targetId, "-")
    .concat(overlay.id);
}

function getOverlays(edge) {
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
}

function getXUpper(vertex) {
  return (vertex.left || 0) + (vertex.width || 0);
}

function getYUpper(vertex) {
  return (vertex.top || 0) + (vertex.height || 0);
}

var getExtremeVertices = (0, _memoizeOne.default)(function(vertices) {
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
});
exports.getExtremeVertices = getExtremeVertices;

function getVerticesMap(vertices) {
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
}

var getVisibleVertices = (0, _memoizeOne.default)(function(
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
});
exports.getVisibleVertices = getVisibleVertices;
var getVisibleEdges = (0, _memoizeOne.default)(function(
  viewport,
  xIntervalTree,
  yIntervalTree,
  version
) {
  var xEdgesMap = new Map();
  var yEdgesMap = new Map();
  var visibleVertices = new Map();
  xIntervalTree.queryInterval(viewport.xMin, viewport.xMax, function(_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 3),
      low = _ref2[0],
      high = _ref2[1],
      edge = _ref2[2];

    xEdgesMap.set(edge.id, edge);
  });
  yIntervalTree.queryInterval(viewport.yMin, viewport.yMax, function(_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
      low = _ref4[0],
      high = _ref4[1],
      edge = _ref4[2];

    yEdgesMap.set(edge.id, edge);
  });
  xEdgesMap.forEach(function(edge, edgeId) {
    if (yEdgesMap.has(edgeId)) {
      visibleVertices.set(edgeId, edge);
    }
  });
  return visibleVertices;
});
exports.getVisibleEdges = getVisibleEdges;

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
    sourceVertexEdgeList = sourceVertexEdgeList.filter(function(presentEdge) {
      return presentEdge.id !== edgeId;
    });
  }

  if (!sourceVertexEdgeList || !sourceVertexEdgeList.length) {
    vToEMap.delete(vertexId);
  } else {
    vToEMap.set(vertexId, sourceVertexEdgeList);
  }
}

var getViewport = (0, _memoizeOne.default)(function(
  scrollLeft,
  scrollTop,
  clientWidth,
  clientHeight,
  zoom
) {
  var scale = 1 / zoom;
  var scrollLeftScaled = scrollLeft * scale;
  var clientWidthScaled = clientWidth * scale;
  var scrollTopScaled = scrollTop * scale;
  var clientHeightScaled = clientHeight * scale;
  return {
    xMin: scrollLeftScaled,
    xMax: scrollLeftScaled + clientWidthScaled,
    yMin: scrollTopScaled,
    yMax: scrollTopScaled + clientHeightScaled
  };
});
exports.getViewport = getViewport;

function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }

  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
}

function makeXIntervalForEdge(edge, v1, v2) {
  var x1 = Math.min(v1.left, v2.left) || 0;
  var x2 = Math.max(
    (v1.left || 0) + (v1.width || 0),
    (v2.left || 0) + (v2.width || 0)
  );
  return [x1, x2, edge];
}

function makeYIntervalForEdge(edge, v1, v2) {
  var y1 = Math.min(v1.top, v2.top) || 0;
  var y2 = Math.max(
    (v1.top || 0) + (v1.height || 0),
    (v2.top || 0) + (v2.height || 0)
  );
  return [y1, y2, edge];
}

var getTranslate3DCoordinates = function getTranslate3DCoordinates(
  clientWidth,
  clientHeight,
  pan,
  zoom,
  contentSpan
) {
  var translateX = pan.x,
    translateY = pan.y;
  var extremeX = Math.max(contentSpan.x, clientWidth),
    extremeY = Math.max(contentSpan.y, clientHeight);

  if (clientWidth >= extremeX * zoom) {
    translateX = ((clientWidth - extremeX) * zoom) / 2;
  }

  if (clientHeight >= extremeY * zoom) {
    translateY = ((clientHeight - extremeY) * zoom) / 2;
  }

  return {
    translateX: translateX,
    translateY: translateY
  };
};

exports.getTranslate3DCoordinates = getTranslate3DCoordinates;

var getScaledScrollValues = function getScaledScrollValues(
  scrollLeft,
  scrollTop,
  zoom,
  previousZoom
) {
  var scale = zoom / previousZoom;
  return {
    scrollLeft: scrollLeft * scale,
    scrollTop: scrollTop * scale
  };
};

var getScaledViewportDimensions = function getScaledViewportDimensions(
  clientWidth,
  clientHeight,
  zoom,
  previousZoom
) {
  var scale = (zoom - previousZoom) / (2 * previousZoom);
  return {
    clientWidth: clientWidth * scale,
    clientHeight: clientHeight * scale
  };
};

var getContainerScroll = function getContainerScroll(
  scrollLeft,
  scrollTop,
  zoom,
  previousZoom,
  clientWidth,
  clientHeight
) {
  var _getScaledScrollValue = getScaledScrollValues(
      scrollLeft,
      scrollTop,
      zoom,
      previousZoom
    ),
    scrollLeftScaled = _getScaledScrollValue.scrollLeft,
    scrollTopScaled = _getScaledScrollValue.scrollTop;

  var _getScaledViewportDim = getScaledViewportDimensions(
      clientWidth,
      clientHeight,
      zoom,
      previousZoom
    ),
    clientWidthScaled = _getScaledViewportDim.clientWidth,
    clientHeightScaled = _getScaledViewportDim.clientHeight;

  return {
    scrollLeft: scrollLeftScaled + clientWidthScaled,
    scrollTop: scrollTopScaled + (scrollTop ? clientHeightScaled : 0)
  };
};

exports.getContainerScroll = getContainerScroll;
