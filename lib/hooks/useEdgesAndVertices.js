"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _helper = require("../helper");

// Libraries
// Helpers
var useEdgesAndVertices = function useEdgesAndVertices(edges, vertices) {
  var verticesRef = (0, React.useRef)(vertices);
  var verticesMapRef = (0, React.useRef)((0, _helper.getVerticesMap)(vertices));
  var verticesToEdgesMapRef = (0, React.useRef)(
    (0, _helper.initVerticesToEdgesMap)(edges)
  );
  var setVertices = (0, React.useCallback)(function(vertices) {
    verticesRef.current = vertices;
    verticesMapRef.current = (0, _helper.getVerticesMap)(vertices);
    return {
      vertices: verticesRef.current,
      verticesMap: verticesMapRef.current
    };
  }, []);
  return {
    vertices: verticesRef.current,
    verticesMapRef: verticesMapRef,
    verticesToEdgesMapRef: verticesToEdgesMapRef,
    setVertices: setVertices
  };
};

var _default = useEdgesAndVertices;
exports.default = _default;
