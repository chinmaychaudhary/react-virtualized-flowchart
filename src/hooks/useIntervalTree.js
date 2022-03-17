// Libraries
import * as React from "react";
import { useRef, useCallback } from "react";
import invariant from "invariant";

// Hooks
import useFirstMountState from "./useFirstMountState";

// Helpers
import {
  makeXIntervalForEdge,
  makeYIntervalForEdge,
  removeNode,
  addEdgeToVerticesToEdgesMap,
  removeEdgeFromVerticesToEdgesMap
} from "../helper";
import createIntervalTree from "../lib/intervalTree";

const useIntervalTree = (edges, verticesMap) => {
  const isFirstMount = useFirstMountState();
  const xIntervalTreeRef = useRef(createIntervalTree());
  const xIntervalTreeNodesRef = useRef({});
  const yIntervalTreeRef = useRef(createIntervalTree());
  const yIntervalTreeNodesRef = useRef({});

  const addToXIntervalTree = useCallback((edge, verticesMap) => {
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
  }, []);

  const addToYIntervalTree = useCallback((edge, verticesMap) => {
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
  }, []);

  if (isFirstMount) {
    edges.forEach(edge => addToXIntervalTree(edge, verticesMap));
    edges.forEach(edge => addToYIntervalTree(edge, verticesMap));
  }

  const updateIntervalTrees = useCallback(
    ({ itemsAdded, itemsRemoved }, verticesMap, verticesToEdgesMap) => {
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
    },
    [addToXIntervalTree, addToYIntervalTree]
  );

  const updateEdges = useCallback(
    ({ itemsAdded, itemsRemoved }, verticesMap, verticesToEdgesMap) => {
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
    },
    [addToXIntervalTree, addToYIntervalTree]
  );

  const getVisibleEdgesHelper = useCallback(viewport => {
    const xEdgesMap = new Map();
    const yEdgesMap = new Map();
    const visibleVertices = new Map();
    xIntervalTreeRef.current.queryInterval(
      viewport.xMin,
      viewport.xMax,
      ([low, high, edge]) => {
        xEdgesMap.set(edge.id, edge);
      }
    );
    yIntervalTreeRef.current.queryInterval(
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
  }, []);

  return {
    getVisibleEdgesHelper,
    updateIntervalTrees,
    updateEdges
  };
};

export default useIntervalTree;
