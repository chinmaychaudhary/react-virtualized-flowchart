import _map from "lodash/map";

export const getAddedOrRemovedItems = (prevItems, nextItems) => {
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
};

export const getOverlayId = (edge, overlay) => {
  const { sourceId, targetId } = edge;
  return `${sourceId}-${targetId}-${overlay.id}`;
};

export const getOverlays = edge => {
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
};

export const getXUpper = vertex => {
  return (vertex.left || 0) + (vertex.width || 0);
};

export const getYUpper = vertex => {
  return (vertex.top || 0) + (vertex.height || 0);
};

export const getExtremeVertices = vertices => {
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
};

export const getVisibleVerticesHelper = (
  universalVerticesMap,
  visibleEdgesMap,
  version
) => {
  const visibleVertices = new Map();
  visibleEdgesMap.forEach(edge => {
    visibleVertices.set(edge.sourceId, universalVerticesMap.get(edge.sourceId));
    visibleVertices.set(edge.targetId, universalVerticesMap.get(edge.targetId));
  });

  return visibleVertices;
};

export const getViewport = (
  scrollLeft,
  scrollTop,
  clientWidth,
  clientHeight
) => ({
  xMin: scrollLeft,
  xMax: scrollLeft + clientWidth,
  yMin: scrollTop,
  yMax: scrollTop + clientHeight
});

export const getVerticesMap = vertices => {
  return new Map(vertices.map((v, index) => [v.id, { vertex: v, index }]));
};

export const addEdge = (vToEMap, edge, vertexId) => {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
};

export const removeEdge = (vToEMap, edgeId, vertexId) => {
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
};

export const initVerticesToEdgesMap = edges =>
  edges.reduce((vToEMap, edge) => {
    addEdge(vToEMap, edge, edge.sourceId);
    addEdge(vToEMap, edge, edge.targetId);
    return vToEMap;
  }, new Map());

export const makeXIntervalForEdge = (edge, v1, v2) => {
  const x1 = Math.min(v1.left, v2.left) || 0;
  const x2 = Math.max(
    (v1.left || 0) + (v1.width || 0),
    (v2.left || 0) + (v2.width || 0)
  );
  return [x1, x2, edge];
};

export const makeYIntervalForEdge = (edge, v1, v2) => {
  const y1 = Math.min(v1.top, v2.top) || 0;
  const y2 = Math.max(
    (v1.top || 0) + (v1.height || 0),
    (v2.top || 0) + (v2.height || 0)
  );
  return [y1, y2, edge];
};

export const removeNode = (intervalTree, intervalTreeNodes, nodeId) => {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }
  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
};

export const addEdgeToVerticesToEdgesMap = (edge, verticesToEdgesMap) => {
  addEdge(verticesToEdgesMap, edge, edge.sourceId);
  addEdge(verticesToEdgesMap, edge, edge.targetId);
};

export const removeEdgeFromVerticesToEdgesMap = (edge, verticesToEdgesMap) => {
  removeEdge(verticesToEdgesMap, edge.id, edge.sourceId);
  removeEdge(verticesToEdgesMap, edge.id, edge.targetId);
};
