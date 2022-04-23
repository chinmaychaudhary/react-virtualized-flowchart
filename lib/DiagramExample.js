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

var _defineProperty2 = _interopRequireDefault(
  require("@babel/runtime/helpers/defineProperty")
);

var _react = _interopRequireWildcard(require("react"));

var _Diagram = _interopRequireDefault(require("./Diagram"));

var _dataReal = require("./data/dataReal");

var _jsxFileName =
  "/Users/ayushmittal/sandbox/react-virtualized-flowchart/src/DiagramExample.js";

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty2.default)(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

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
          ? _objectSpread({}, vertex, {
              left: action.payload.finalPos[0],
              top: action.payload.finalPos[1]
            })
          : vertex;
      });
      return _objectSpread({}, state, {
        vertices: vertices
      });
    }
  }
}

function Vertex(_ref2) {
  var vertex = _ref2.vertex,
    index = _ref2.index;
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
      "data-index": index,
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
          lineNumber: 48
        }
      },
      index
    )
  );
}

function DiagramExample() {
  var _useReducer = (0, _react.useReducer)(reducer, initialState, init),
    _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];

  var renderVertex = (0, _react.useCallback)(function(_ref3) {
    var vertex = _ref3.vertex,
      index = _ref3.index;
    return _react.default.createElement(Vertex, {
      vertex: vertex,
      index: index,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56
      }
    });
  }, []);
  var renderBackground = (0, _react.useCallback)(function(x, y) {
    return _react.default.createElement("div", {
      className: "sq-bg",
      style: {
        height: "".concat(y, "px"),
        width: "".concat(x, "px")
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61
      }
    });
  }, []);
  return _react.default.createElement(_Diagram.default, {
    onAction: dispatch,
    vertices: state.vertices,
    edges: state.edges,
    renderVertex: renderVertex,
    renderBackground: renderBackground,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    }
  });
}
