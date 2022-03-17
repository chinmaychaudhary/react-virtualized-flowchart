// Libraries
import * as React from "react";
import { useRef, useCallback } from "react";

// Helpers
import { getVerticesMap, initVerticesToEdgesMap } from "../helper";

const useEdgesAndVertices = (edges, vertices) => {
  const verticesRef = useRef(vertices);
  const verticesMapRef = useRef(getVerticesMap(vertices));
  const verticesToEdgesMapRef = useRef(initVerticesToEdgesMap(edges));

  const setVertices = useCallback(vertices => {
    verticesRef.current = vertices;
    verticesMapRef.current = getVerticesMap(vertices);
    return {
      vertices: verticesRef.current,
      verticesMap: verticesMapRef.current
    };
  }, []);

  return {
    vertices: verticesRef.current,
    verticesMapRef,
    verticesToEdgesMapRef,
    setVertices
  };
};

export default useEdgesAndVertices;
