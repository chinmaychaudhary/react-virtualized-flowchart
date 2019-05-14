"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _Diagram = _interopRequireDefault(require("./Diagram"));

var data1 = _interopRequireWildcard(require("./data/data1"));

var data2 = _interopRequireWildcard(require("./data/data2"));

var _DiagramExample = _interopRequireDefault(require("./DiagramExample"));

require("./styles.css");

var _jsxFileName =
  "/Users/chicho17/try/react-virtualized-flowchart/src/index.js";

function App() {
  var _useState = (0, _react.useState)(data1.nodes),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    nodes = _useState2[0],
    setNodes = _useState2[1];

  var _useState3 = (0, _react.useState)(
      (0, _toConsumableArray2.default)(data1.connections)
    ),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    connections = _useState4[0],
    setConnections = _useState4[1];

  var handleAdd = (0, _react.useCallback)(
    function() {
      setNodes(
        [].concat(
          (0, _toConsumableArray2.default)(nodes),
          (0, _toConsumableArray2.default)(data2.nodes)
        )
      );
      setConnections(
        [].concat(
          (0, _toConsumableArray2.default)(connections),
          [
            {
              id: "3-4",
              sourceId: "3",
              targetId: "4"
            }
          ],
          (0, _toConsumableArray2.default)(data2.connections)
        )
      );
    },
    [nodes, connections]
  );
  var handleDetach = (0, _react.useCallback)(
    function() {
      setConnections(
        connections.filter(function(i) {
          return i.id !== "3-4";
        })
      );
    },
    [connections]
  );
  var handleAttach = (0, _react.useCallback)(
    function() {
      setConnections(
        [].concat((0, _toConsumableArray2.default)(connections), [
          {
            id: "3-4",
            sourceId: "3",
            targetId: "4"
          }
        ])
      );
    },
    [connections]
  );
  var handleRemove = (0, _react.useCallback)(function() {
    setNodes(data1.nodes);
    setConnections(data1.connections);
  });
  var stateMachineForSubtree = (0, _react.useMemo)(
    function() {
      return {
        ss1: {
          label: "Add subtree to 3",
          next: "ss2",
          handler: handleAdd
        },
        ss2: {
          label: "remove subtree",
          next: "ss1",
          handler: handleRemove
        }
      };
    },
    [handleAdd, handleRemove]
  );
  var stateMachineConnections = (0, _react.useMemo)(
    function() {
      return {
        sc1: {
          label: "remove 3-4 connection",
          next: "sc2",
          handler: handleDetach
        },
        sc2: {
          label: "connect 3-4",
          next: "sc1",
          handler: handleAttach
        }
      };
    },
    [handleDetach, handleAttach]
  );

  var _useState5 = (0, _react.useState)("ss1"),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    currentState1 = _useState6[0],
    setCurrentState1 = _useState6[1];

  var _useState7 = (0, _react.useState)("sc1"),
    _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
    currentState2 = _useState8[0],
    setCurrentState2 = _useState8[1];

  var handleButton1Click = function handleButton1Click() {
    stateMachineForSubtree[currentState1].handler();
    setCurrentState1(stateMachineForSubtree[currentState1].next);
  };

  var handleButton2Click = function handleButton2Click() {
    stateMachineConnections[currentState2].handler();
    setCurrentState2(stateMachineConnections[currentState2].next);
  };

  return _react.default.createElement(
    "div",
    {
      className: "App",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 98
      }
    },
    _react.default.createElement(_Diagram.default, {
      nodes: nodes,
      connections: connections,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 99
      }
    }),
    _react.default.createElement(
      "button",
      {
        onClick: handleButton1Click,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 100
        }
      },
      stateMachineForSubtree[currentState1].label
    ),
    _react.default.createElement(
      "button",
      {
        onClick: handleButton2Click,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 103
        }
      },
      stateMachineConnections[currentState2].label
    )
  );
}

var rootElement = document.getElementById("root");

_reactDom.default.render(
  _react.default.createElement(_DiagramExample.default, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 111
    }
  }),
  rootElement
);
