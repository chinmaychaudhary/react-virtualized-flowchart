"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEdge = addEdge;
exports.getAddedOrRemovedItems = getAddedOrRemovedItems;
exports.getExtremeVertices = exports.getContainerScroll = void 0;
exports.getOverlayId = getOverlayId;
exports.getOverlays = getOverlays;
exports.getTranslate3DCoordinates = exports.getResizeObserver = void 0;
exports.getVerticesMap = getVerticesMap;
exports.getVisibleVertices = exports.getVisibleEdges = exports.getViewport = void 0;
exports.getXUpper = getXUpper;
exports.getYUpper = getYUpper;
exports.makeXIntervalForEdge = makeXIntervalForEdge;
exports.makeYIntervalForEdge = makeYIntervalForEdge;
exports.removeEdge = removeEdge;
exports.removeNode = removeNode;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _map2 = _interopRequireDefault(require("lodash/map"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

function getAddedOrRemovedItems(prevItems, nextItems) {
  var prevMap = new Map(prevItems.map(function (i) {
    return [i.id, i];
  }));
  var nextMap = new Map(nextItems.map(function (i) {
    return [i.id, i];
  }));
  var itemsAdded = [];
  var itemsRemoved = [];
  var itemsUpdated = [];
  prevMap.forEach(function (value, id) {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });
  nextMap.forEach(function (value, id) {
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
  return "".concat(sourceId, "-").concat(targetId, "-").concat(overlay.id);
}

function getOverlays(edge) {
  var customOverlays = (0, _map2.default)(edge.customOverlays, function (customOverlay) {
    var id = customOverlay.id,
        location = customOverlay.location;
    return ["Custom", {
      create: function create() {
        var overlayDiv = document.createElement("div");
        overlayDiv.setAttribute("id", getOverlayId(edge, customOverlay));
        return overlayDiv;
      },
      location: location,
      id: id
    }];
  });
  return [].concat((0, _toConsumableArray2.default)(edge.overlays || []), (0, _toConsumableArray2.default)(customOverlays));
}

function getXUpper(vertex) {
  return (vertex.left || 0) + (vertex.width || 0);
}

function getYUpper(vertex) {
  return (vertex.top || 0) + (vertex.height || 0);
}

var getExtremeVertices = (0, _memoizeOne.default)(function (vertices) {
  return vertices.reduce(function (res, vertex) {
    if (getXUpper(res.rightMostVertex) < getXUpper(vertex)) {
      res.rightMostVertex = vertex;
    }

    if (getYUpper(res.bottomMostVertex) < getYUpper(vertex)) {
      res.bottomMostVertex = vertex;
    }

    return res;
  }, {
    rightMostVertex: {
      left: -1,
      width: 0
    },
    bottomMostVertex: {
      top: -1,
      height: 0
    }
  });
});
exports.getExtremeVertices = getExtremeVertices;

function getVerticesMap(vertices) {
  return new Map(vertices.map(function (v, index) {
    return [v.id, {
      vertex: v,
      index: index
    }];
  }));
}

var getVisibleVertices = (0, _memoizeOne.default)(function (universalVerticesMap, visibleEdgesMap, version) {
  var visibleVertices = new Map();
  visibleEdgesMap.forEach(function (edge) {
    visibleVertices.set(edge.sourceId, universalVerticesMap.get(edge.sourceId));
    visibleVertices.set(edge.targetId, universalVerticesMap.get(edge.targetId));
  });
  return visibleVertices;
});
exports.getVisibleVertices = getVisibleVertices;
var getVisibleEdges = (0, _memoizeOne.default)(function (viewport, xIntervalTree, yIntervalTree, treeNodeById, version) {
  var yEdgesSet = new Set();
  var visibleEdges = new Map();
  yIntervalTree.search([viewport.yMin, viewport.yMax], function (edgeId) {
    yEdgesSet.add(edgeId);
  });
  xIntervalTree.search([viewport.xMin, viewport.xMax], function (edgeId) {
    if (yEdgesSet.has(edgeId)) {
      visibleEdges.set(edgeId, treeNodeById[edgeId].edge);
    }
  });
  return visibleEdges;
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
    sourceVertexEdgeList = sourceVertexEdgeList.filter(function (presentEdge) {
      return presentEdge.id !== edgeId;
    });
  }

  if (!sourceVertexEdgeList || !sourceVertexEdgeList.length) {
    vToEMap.delete(vertexId);
  } else {
    vToEMap.set(vertexId, sourceVertexEdgeList);
  }
}

var getViewport = (0, _memoizeOne.default)(function (scrollLeft, scrollTop, clientWidth, clientHeight, zoom) {
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

function removeNode(xIntervalTree, yIntervalTree, treeNodeById, nodeId) {
  var treeNode = treeNodeById[nodeId];

  if (treeNode) {
    if (treeNode !== null && treeNode !== void 0 && treeNode.xInterval) {
      xIntervalTree.remove(treeNode.xInterval, nodeId);
    }

    if (treeNode !== null && treeNode !== void 0 && treeNode.yInterval) {
      yIntervalTree.remove(treeNode.yInterval, nodeId);
    }

    delete treeNodeById[nodeId];
  }
}

function makeXIntervalForEdge(edge, v1, v2) {
  var x1 = Math.min(v1.left, v2.left) || 0;
  var x2 = Math.max((v1.left || 0) + (v1.width || 0), (v2.left || 0) + (v2.width || 0));
  return [x1, x2];
}

function makeYIntervalForEdge(edge, v1, v2) {
  var y1 = Math.min(v1.top, v2.top) || 0;
  var y2 = Math.max((v1.top || 0) + (v1.height || 0), (v2.top || 0) + (v2.height || 0));
  return [y1, y2];
}
/*
 * If, flowchart content is smaller than actual length of the container-axis (X or Y),
 * we need to shift origin to center of axis instead of (X:0 or Y:0),
 * So that content remains in center of the container.
 * In order to shift content to center we need to translate axis coordinate to (axisLength - containerLength)/2
 *
 * Else, Just use origin shift as per use-pan-and-zoom library
 */


var getTranslate3DCoordinates = function getTranslate3DCoordinates(clientWidth, clientHeight, pan, zoom, contentSpan) {
  var translateX = pan.x,
      translateY = pan.y;
  var extremeX = Math.max(contentSpan.x, clientWidth),
      extremeY = Math.max(contentSpan.y, clientHeight);

  if (clientWidth >= extremeX * zoom) {
    translateX = (clientWidth - extremeX) * zoom / 2;
  }

  if (clientHeight >= extremeY * zoom) {
    translateY = (clientHeight - extremeY) * zoom / 2;
  }

  return {
    translateX: translateX,
    translateY: translateY
  };
};

exports.getTranslate3DCoordinates = getTranslate3DCoordinates;

var getScaledScrollValues = function getScaledScrollValues(scrollLeft, scrollTop, zoom, previousZoom) {
  var scale = zoom / previousZoom;
  return {
    scrollLeft: scrollLeft * scale,
    scrollTop: scrollTop * scale
  };
};

var getScaledViewportDimensions = function getScaledViewportDimensions(clientWidth, clientHeight, zoom, previousZoom) {
  var scale = (zoom - previousZoom) / (2 * previousZoom);
  return {
    clientWidth: clientWidth * scale,
    clientHeight: clientHeight * scale
  };
};
/*
 * On changing zoom-level, we need to move scrollbar accordingly,
 * so that the center-of-content remain the same as it was on previous zoom.
 *
 * In order to make sure that center of content still persists at center of current viewport,
 * we need to shift scrollBar to (scale* prevScroll) +/- ((actual content exposed/removed to viewport)/2),
 * content exposed/removed signifies the part of content which is visible/hidden on inc/dec zoom to accommodate the fixed browser viewport
 */


var getContainerScroll = function getContainerScroll(scrollLeft, scrollTop, zoom, previousZoom, clientWidth, clientHeight) {
  var _getScaledScrollValue = getScaledScrollValues(scrollLeft, scrollTop, zoom, previousZoom),
      scrollLeftScaled = _getScaledScrollValue.scrollLeft,
      scrollTopScaled = _getScaledScrollValue.scrollTop;

  var _getScaledViewportDim = getScaledViewportDimensions(clientWidth, clientHeight, zoom, previousZoom),
      clientWidthScaled = _getScaledViewportDim.clientWidth,
      clientHeightScaled = _getScaledViewportDim.clientHeight;

  return {
    scrollLeft: scrollLeftScaled + clientWidthScaled,
    scrollTop: scrollTopScaled + (scrollTop ? clientHeightScaled : 0)
  };
};

exports.getContainerScroll = getContainerScroll;

var getResizeObserver = function getResizeObserver() {
  return typeof window !== "undefined" ? window.ResizeObserver || _resizeObserverPolyfill.default : _resizeObserverPolyfill.default;
};

exports.getResizeObserver = getResizeObserver;