"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

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

var addEdge = function addEdge(vToEMap, edge, vertexId) {
  var sourceVertexEdgeList = vToEMap.get(vertexId);

  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
};

var initVerticesToEdgesMap = function initVerticesToEdgesMap(edges) {
  return edges.reduce(function(vToEMap, edge) {
    addEdge(vToEMap, edge, edge.sourceId);
    addEdge(vToEMap, edge, edge.targetId);
    return vToEMap;
  }, new Map());
};

var useEdgesAndVertices = function useEdgesAndVertices(edges, vertices) {
  var verticesRef = (0, _react.useRef)(vertices);
  var verticesMapRef = (0, _react.useRef)(getVerticesMap(vertices));
  var verticesToEdgesMapRef = (0, _react.useRef)(initVerticesToEdgesMap(edges));

  var setVertices = function setVertices(vertices) {
    verticesRef.current = vertices;
    verticesMapRef.current = getVerticesMap(vertices);
    return {
      vertices: verticesRef.current,
      verticesMap: verticesMapRef.current
    };
  };

  return {
    vertices: verticesRef.current,
    verticesMapRef: verticesMapRef,
    verticesToEdgesMapRef: verticesToEdgesMapRef,
    setVertices: setVertices
  };
};

var _default = useEdgesAndVertices;
exports.default = _default;
