import _map from "lodash/map";
import memoizeOne from "memoize-one";

export function getAddedOrRemovedItems(prevItems, nextItems) {
  const prevMap = new Map(prevItems.map(i => [i.id, i]));
  const nextMap = new Map(nextItems.map(i => [i.id, i]));
  const itemsAdded = [];
  const itemsRemoved = [];
  const itemsUpdated = [];

  prevMap.forEach((value, id) => {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });

  nextMap.forEach((value, id) => {
    if (!prevMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
      itemsAdded.push(value);
    }
  });

  return {
    itemsAdded,
    itemsRemoved,
    itemsUpdated
  };
}

export function getOverlayId(edge, overlay) {
  const { sourceId, targetId } = edge;
  return `${sourceId}-${targetId}-${overlay.id}`;
}

export function getOverlays(edge) {
  const customOverlays = _map(edge.customOverlays, customOverlay => {
    const { id, location } = customOverlay;
    return [
      "Custom",
      {
        create: () => {
          const overlayDiv = document.createElement("div");
          overlayDiv.setAttribute("id", getOverlayId(edge, customOverlay));
          return overlayDiv;
        },
        location,
        id
      }
    ];
  });

  return [...(edge.overlays || []), ...customOverlays];
}

export function getXUpper(vertex) {
  return (vertex.left || 0) + (vertex.width || 0);
}

export function getYUpper(vertex) {
  return (vertex.top || 0) + (vertex.height || 0);
}

export const getExtremeVertices = memoizeOne(vertices => {
  return vertices.reduce(
    (res, vertex) => {
      if (getXUpper(res.rightMostVertex) < getXUpper(vertex)) {
        res.rightMostVertex = vertex;
      }

      if (getYUpper(res.bottomMostVertex) < getYUpper(vertex)) {
        res.bottomMostVertex = vertex;
      }

      return res;
    },
    {
      rightMostVertex: { left: -1, width: 0 },
      bottomMostVertex: { top: -1, height: 0 }
    }
  );
});

export function getVerticesMap(vertices) {
  return new Map(vertices.map((v, index) => [v.id, { vertex: v, index }]));
}

export const getVisibleVertices = memoizeOne(
  (universalVerticesMap, visibleEdgesMap, version) => {
    const visibleVertices = new Map();
    visibleEdgesMap.forEach(edge => {
      visibleVertices.set(
        edge.sourceId,
        universalVerticesMap.get(edge.sourceId)
      );
      visibleVertices.set(
        edge.targetId,
        universalVerticesMap.get(edge.targetId)
      );
    });

    return visibleVertices;
  }
);

export const getVisibleEdges = memoizeOne(
  (viewport, xIntervalTree, yIntervalTree, version) => {
    const xEdgesMap = new Map();
    const yEdgesMap = new Map();
    const visibleVertices = new Map();
    xIntervalTree.queryInterval(
      viewport.xMin,
      viewport.xMax,
      ([low, high, edge]) => {
        xEdgesMap.set(edge.id, edge);
      }
    );
    yIntervalTree.queryInterval(
      viewport.yMin,
      viewport.yMax,
      ([low, high, edge]) => {
        yEdgesMap.set(edge.id, edge);
      }
    );

    xEdgesMap.forEach((edge, edgeId) => {
      if (yEdgesMap.has(edgeId)) {
        visibleVertices.set(edgeId, edge);
      }
    });

    return visibleVertices;
  }
);

export function addEdge(vToEMap, edge, vertexId) {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
}

export function removeEdge(vToEMap, edgeId, vertexId) {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList = sourceVertexEdgeList.filter(
      presentEdge => presentEdge.id !== edgeId
    );
  }
  if (!sourceVertexEdgeList || !sourceVertexEdgeList.length) {
    vToEMap.delete(vertexId);
  } else {
    vToEMap.set(vertexId, sourceVertexEdgeList);
  }
}

export const getViewport = memoizeOne(
  (scrollLeft, scrollTop, clientWidth, clientHeight, zoom) => {
    const scale = 1 / zoom;

    const scrollLeftScaled = scrollLeft * scale;
    const clientWidthScaled = clientWidth * scale;
    const scrollTopScaled = scrollTop * scale;
    const clientHeightScaled = clientHeight * scale;

    return {
      xMin: scrollLeftScaled,
      xMax: scrollLeftScaled + clientWidthScaled,
      yMin: scrollTopScaled,
      yMax: scrollTopScaled + clientHeightScaled
    };
  }
);

export function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }
  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
}

export function makeXIntervalForEdge(edge, v1, v2) {
  const x1 = Math.min(v1.left, v2.left) || 0;
  const x2 = Math.max(
    (v1.left || 0) + (v1.width || 0),
    (v2.left || 0) + (v2.width || 0)
  );
  return [x1, x2, edge];
}

export function makeYIntervalForEdge(edge, v1, v2) {
  const y1 = Math.min(v1.top, v2.top) || 0;
  const y2 = Math.max(
    (v1.top || 0) + (v1.height || 0),
    (v2.top || 0) + (v2.height || 0)
  );
  return [y1, y2, edge];
}

export const getTranslate3DCoordinates = (
  clientWidth,
  clientHeight,
  pan,
  zoom,
  contentSpan
) => {
  let translateX = pan.x,
    translateY = pan.y;

  const extremeX = Math.max(contentSpan.x, clientWidth),
    extremeY = Math.max(contentSpan.y, clientHeight);

  if (clientWidth >= extremeX * zoom) {
    translateX = ((clientWidth - extremeX) * zoom) / 2;
  }
  if (clientHeight >= extremeY * zoom) {
    translateY = ((clientHeight - extremeY) * zoom) / 2;
  }

  return {
    translateX,
    translateY
  };
};

const getScaledScrollValues = (scrollLeft, scrollTop, zoom, previousZoom) => {
  const scale = zoom / previousZoom;

  return {
    scrollLeft: scrollLeft * scale,
    scrollTop: scrollTop * scale
  };
};

const getScaledViewportDimensions = (
  clientWidth,
  clientHeight,
  zoom,
  previousZoom
) => {
  const scale = (zoom - previousZoom) / (2 * previousZoom);

  return {
    clientWidth: clientWidth * scale,
    clientHeight: clientHeight * scale
  };
};

export const getContainerScroll = (
  scrollLeft,
  scrollTop,
  zoom,
  previousZoom,
  clientWidth,
  clientHeight
) => {
  const {
    scrollLeft: scrollLeftScaled,
    scrollTop: scrollTopScaled
  } = getScaledScrollValues(scrollLeft, scrollTop, zoom, previousZoom);
  const {
    clientWidth: clientWidthScaled,
    clientHeight: clientHeightScaled
  } = getScaledViewportDimensions(
    clientWidth,
    clientHeight,
    zoom,
    previousZoom
  );
  return {
    scrollLeft: scrollLeftScaled + clientWidthScaled,
    scrollTop: scrollTopScaled + (scrollTop ? clientHeightScaled : 0)
  };
};
