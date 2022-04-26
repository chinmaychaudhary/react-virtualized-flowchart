"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DiagramExample;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _Diagram = _interopRequireDefault(require("./Diagram"));

var _dataReal = require("./data/dataReal");

var _jsxFileName = "/Users/chicho/repos/react-virtualized-flowchart/src/DiagramExample.js";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
    case "ITEM_DRAGGED":
      {
        var vertices = state.vertices.map(function (vertex) {
          return vertex.id === action.payload.vertexEl.dataset.id ? _objectSpread(_objectSpread({}, vertex), {}, {
            left: action.payload.finalPos[0],
            top: action.payload.finalPos[1]
          }) : vertex;
        });
        return _objectSpread(_objectSpread({}, state), {}, {
          vertices: vertices
        });
      }
  }
}

function Vertex(_ref2) {
  var vertex = _ref2.vertex,
      index = _ref2.index;
  return /*#__PURE__*/_react.default.createElement("div", {
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
  }, /*#__PURE__*/_react.default.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    }
  }, index));
}

function DiagramExample() {
  var _useReducer = (0, _react.useReducer)(reducer, initialState, init),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var renderVertex = (0, _react.useCallback)(function (_ref3) {
    var vertex = _ref3.vertex,
        index = _ref3.index;
    return /*#__PURE__*/_react.default.createElement(Vertex, {
      vertex: vertex,
      index: index,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56
      }
    });
  }, []);
  var renderBackground = (0, _react.useCallback)(function (x, y) {
    return /*#__PURE__*/_react.default.createElement("div", {
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
  return /*#__PURE__*/_react.default.createElement(_Diagram.default, {
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