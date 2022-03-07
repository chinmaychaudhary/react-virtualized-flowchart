import { useRef } from "react";

const getVerticesMap = vertices => {
  return new Map(vertices.map((v, index) => [v.id, { vertex: v, index }]));
};

const addEdge = (vToEMap, edge, vertexId) => {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
};

const initVerticesToEdgesMap = edges =>
  edges.reduce((vToEMap, edge) => {
    addEdge(vToEMap, edge, edge.sourceId);
    addEdge(vToEMap, edge, edge.targetId);
    return vToEMap;
  }, new Map());

const useEdgesAndVertices = (edges, vertices) => {
  const verticesRef = useRef(vertices);
  const verticesMapRef = useRef(getVerticesMap(vertices));
  const verticesToEdgesMapRef = useRef(initVerticesToEdgesMap(edges));

  const setVertices = vertices => {
    verticesRef.current = vertices;
    verticesMapRef.current = getVerticesMap(vertices);
    return {
      vertices: verticesRef.current,
      verticesMap: verticesMapRef.current
    };
  };

  return {
    vertices: verticesRef.current,
    verticesMapRef,
    verticesToEdgesMapRef,
    setVertices
  };
};

export default useEdgesAndVertices;
