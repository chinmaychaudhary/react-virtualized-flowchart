import { useRef } from "react";
import invariant from "invariant";
import useFirstMountState from "react-use/lib/useFirstMountState";

import createIntervalTree from "../lib/intervalTree";

const makeXIntervalForEdge = (edge, v1, v2) => {
  const x1 = Math.min(v1.left, v2.left) || 0;
  const x2 = Math.max(
    (v1.left || 0) + (v1.width || 0),
    (v2.left || 0) + (v2.width || 0)
  );
  return [x1, x2, edge];
};

const makeYIntervalForEdge = (edge, v1, v2) => {
  const y1 = Math.min(v1.top, v2.top) || 0;
  const y2 = Math.max(
    (v1.top || 0) + (v1.height || 0),
    (v2.top || 0) + (v2.height || 0)
  );
  return [y1, y2, edge];
};

const removeNode = (intervalTree, intervalTreeNodes, nodeId) => {
  if (!intervalTreeNodes[nodeId]) {
    return;
  }
  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
};

const removeEdge = (vToEMap, edgeId, vertexId) => {
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

const addEdge = (vToEMap, edge, vertexId) => {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
};

const useIntervalTree = (edges, verticesMap) => {
  const isFirstMount = useFirstMountState();
  const xIntervalTreeRef = useRef(createIntervalTree());
  const xIntervalTreeNodesRef = useRef({});
  const yIntervalTreeRef = useRef(createIntervalTree());
  const yIntervalTreeNodesRef = useRef({});

  const addToXIntervalTree = (edge, verticesMap) => {
    const edgeId = edge.id;
    if (xIntervalTreeNodesRef.current[edgeId]) {
      return;
    }

    const sourceVertex = verticesMap.get(edge.sourceId);
    invariant(sourceVertex, `sourceVertex missing for the edgeId - ${edgeId}`);
    const targetVertex = verticesMap.get(edge.targetId);
    invariant(targetVertex, `targetVertex missing for the edgeId - ${edgeId}`);

    const interval = makeXIntervalForEdge(
      edge,
      sourceVertex.vertex,
      targetVertex.vertex
    );

    xIntervalTreeNodesRef.current[edgeId] = interval;
    xIntervalTreeRef.current.insert(interval);
  };

  const addToYIntervalTree = (edge, verticesMap) => {
    const edgeId = edge.id;
    if (yIntervalTreeNodesRef.current[edgeId]) {
      return;
    }

    const sourceVertex = verticesMap.get(edge.sourceId);
    invariant(sourceVertex, `sourceVertex missing for the edgeId - ${edgeId}`);
    const targetVertex = verticesMap.get(edge.targetId);
    invariant(targetVertex, `targetVertex missing for the edgeId - ${edgeId}`);

    const interval = makeYIntervalForEdge(
      edge,
      sourceVertex.vertex,
      targetVertex.vertex
    );

    yIntervalTreeNodesRef.current[edgeId] = interval;
    yIntervalTreeRef.current.insert(interval);
  };

  if (isFirstMount) {
    edges.forEach(edge => addToXIntervalTree(edge, verticesMap));
    edges.forEach(edge => addToYIntervalTree(edge, verticesMap));
  }

  const updateIntervalTrees = (
    { itemsAdded, itemsRemoved },
    verticesMap,
    verticesToEdgesMap
  ) => {
    itemsRemoved.forEach(vertex => {
      const vertexId = vertex.id;
      const edges = verticesToEdgesMap.get(vertexId) || [];
      edges.forEach(edge => {
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
    itemsAdded.forEach(vertex => {
      const edges = verticesToEdgesMap.get(vertex.id);

      edges.forEach(edge => {
        addToXIntervalTree(edge, verticesMap);
        addToYIntervalTree(edge, verticesMap);
      });
    });
  };

  const addEdgeToVerticesToEdgesMap = (edge, verticesToEdgesMap) => {
    addEdge(verticesToEdgesMap, edge, edge.sourceId);
    addEdge(verticesToEdgesMap, edge, edge.targetId);
  };

  const removeEdgeFromVerticesToEdgesMap = (edge, verticesToEdgesMap) => {
    removeEdge(verticesToEdgesMap, edge.id, edge.sourceId);
    removeEdge(verticesToEdgesMap, edge.id, edge.targetId);
  };

  const updateEdges = (
    { itemsAdded, itemsRemoved },
    verticesMap,
    verticesToEdgesMap
  ) => {
    const xIntervalIdToIndex = new Map(
      xIntervalTreeRef.current.intervals.map(([a, b, edge], index) => [
        edge.id,
        index
      ])
    );
    const xSortedItemsToRemove = [...itemsRemoved].sort(
      (itemA, itemB) =>
        (xIntervalIdToIndex.get(itemA.id) || 0) -
        (xIntervalIdToIndex.get(itemB.id) || 0)
    );

    const yIntervalIdToIndex = new Map(
      yIntervalTreeRef.current.intervals.map(([a, b, edge], index) => [
        edge.id,
        index
      ])
    );
    const ySortedItemsToRemove = [...itemsRemoved].sort(
      (itemA, itemB) =>
        (yIntervalIdToIndex.get(itemA.id) || 0) -
        (yIntervalIdToIndex.get(itemB.id) || 0)
    );

    itemsRemoved.forEach(edge => {
      removeEdgeFromVerticesToEdgesMap(edge, verticesToEdgesMap);
    });

    xSortedItemsToRemove.forEach(edge => {
      const edgeId = edge.id;
      removeNode(
        xIntervalTreeRef.current,
        xIntervalTreeNodesRef.current,
        edgeId
      );
    });

    ySortedItemsToRemove.forEach(edge => {
      const edgeId = edge.id;
      removeNode(
        yIntervalTreeRef.current,
        yIntervalTreeNodesRef.current,
        edgeId
      );
    });

    itemsAdded.forEach(edge => {
      addEdgeToVerticesToEdgesMap(edge, verticesToEdgesMap);
      addToXIntervalTree(edge, verticesMap);
      addToYIntervalTree(edge, verticesMap);
    });

    return { verticesToEdgesMap };
  };

  return {
    xIntervalTree: xIntervalTreeRef.current,
    yIntervalTree: yIntervalTreeRef.current,
    updateIntervalTrees,
    updateEdges
  };
};

export default useIntervalTree;
