"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DiagramExample;

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var _objectSpread2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectSpread")
);

var _react = _interopRequireWildcard(require("react"));

var _Diagram = _interopRequireDefault(require("./Diagram"));

var _dataReal = require("./data/dataReal");

var _jsxFileName =
  "/Users/chicho17/try/react-virtualized-flowchart/src/DiagramExample.js";
var initialState = {
  initialVertices: _dataReal.vertices,
  initialEdges: _dataReal.edges
};

function init(_ref) {
  var initialVertices = _ref.initialVertices,
    initialEdges = _ref.initialEdges;
  return {
    vertices: initialVertices,
    edges: initialEdges
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ITEM_DRAGGED": {
      var vertices = state.vertices.map(function(vertex) {
        return vertex.id === action.payload.vertexEl.dataset.id
          ? (0, _objectSpread2.default)({}, vertex, {
              left: action.payload.finalPos[0],
              top: action.payload.finalPos[1]
            })
          : vertex;
      });
      return (0, _objectSpread2.default)({}, state, {
        vertices: vertices
      });
    }
  }
}

function Vertex(_ref2) {
  var vertex = _ref2.vertex;
  return _react.default.createElement(
    "div",
    {
      id: vertex.id,
      className: "vertex",
      style: {
        height: vertex.height,
        width: vertex.width,
        position: "absolute",
        left: vertex.left,
        top: vertex.top
      },
      "data-id": vertex.id,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35
      }
    },
    _react.default.createElement(
      "span",
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        }
      },
      JSON.stringify(vertex)
    )
  );
}

function DiagramExample() {
  var _useReducer = (0, _react.useReducer)(reducer, initialState, init),
    _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];

  var renderVertex = (0, _react.useCallback)(function(_ref3) {
    var vertex = _ref3.vertex;
    return _react.default.createElement(Vertex, {
      vertex: vertex,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 55
      }
    });
  }, []);
  return _react.default.createElement(_Diagram.default, {
    onAction: dispatch,
    vertices: state.vertices,
    edges: state.edges,
    renderVertex: renderVertex,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    }
  });
}
