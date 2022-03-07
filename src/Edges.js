// Libraries
import * as React from "react";
import PropTypes from "prop-types";

// Components
import Overlays from "./Overlays";

// Hooks
import usePlumbInstance from "./hooks/usePlumbInstance";

const Edges = props => {
  const { overlayEdges } = usePlumbInstance(props);

  return (
    <Overlays edges={overlayEdges} renderOverlays={props.renderOverlays} />
  );
};

Edges.displayName = "Edges";
Edges.propTypes = {
  draggableOptions: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.number),
    consumeStartEvent: PropTypes.bool,
    getConstrainingRectangle: PropTypes.func,
    containment: PropTypes.bool
  }),
  droppableOptions: PropTypes.shape({
    canDrop: PropTypes.func,
    hoverClass: PropTypes.string
  }),
  renderOverlays: PropTypes.func
};
Edges.defaultProps = {
  sourceEndpointStyles: {
    paintStyle: { radius: 1 },
    connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
  },
  sourceEndpointOptions: {
    anchor: "Bottom"
  },
  targetEndpointStyles: {
    paintStyle: { fill: "blue", radius: 1 },
    connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
  },
  targetEndpointOptions: {
    anchor: "Top"
  },
  edgeStyles: {
    paintStyle: { stroke: "black" },
    connector: ["Flowchart", { curviness: 0, cornerRadius: 20 }]
  }
};

export default Edges;
