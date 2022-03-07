"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Overlays = _interopRequireDefault(require("./Overlays"));

var _usePlumbInstance2 = _interopRequireDefault(
  require("./hooks/usePlumbInstance")
);

var _jsxFileName =
  "/Users/ujjawalpabreja/Desktop/react-virtualized-flowchart/src/Edges.js";

var Edges = function Edges(props) {
  var _usePlumbInstance = (0, _usePlumbInstance2.default)(props),
    overlayEdges = _usePlumbInstance.overlayEdges;

  return React.createElement(_Overlays.default, {
    edges: overlayEdges,
    renderOverlays: props.renderOverlays,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    }
  });
};

Edges.displayName = "Edges";
Edges.propTypes = {
  draggableOptions: _propTypes.default.shape({
    grid: _propTypes.default.arrayOf(_propTypes.default.number),
    consumeStartEvent: _propTypes.default.bool,
    getConstrainingRectangle: _propTypes.default.func,
    containment: _propTypes.default.bool
  }),
  droppableOptions: _propTypes.default.shape({
    canDrop: _propTypes.default.func,
    hoverClass: _propTypes.default.string
  }),
  renderOverlays: _propTypes.default.func
};
Edges.defaultProps = {
  sourceEndpointStyles: {
    paintStyle: {
      radius: 1
    },
    connectorPaintStyle: {
      stroke: "blue",
      strokeWidth: 0
    }
  },
  sourceEndpointOptions: {
    anchor: "Bottom"
  },
  targetEndpointStyles: {
    paintStyle: {
      fill: "blue",
      radius: 1
    },
    connectorPaintStyle: {
      stroke: "blue",
      strokeWidth: 0
    }
  },
  targetEndpointOptions: {
    anchor: "Top"
  },
  edgeStyles: {
    paintStyle: {
      stroke: "black"
    },
    connector: [
      "Flowchart",
      {
        curviness: 0,
        cornerRadius: 20
      }
    ]
  }
};
var _default = Edges;
exports.default = _default;
