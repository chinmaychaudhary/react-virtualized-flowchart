import React, { PureComponent } from "react";
import { jsPlumb } from "jsplumb";

import { getAddedOrRemovedItems } from "./helper";

class Edges extends PureComponent {
  componentDidMount() {
    jsPlumb.ready(() => {
      this.plumbInstance = jsPlumb.getInstance(this.props.containerEl);
      this.plumbConnections = {};
      this.drawConnections();
      this.makeVerticesDraggable(this.props.vertices);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.edges !== this.props.edges) {
      this.updateConnections(
        getAddedOrRemovedItems(prevProps.edges, this.props.edges)
      );
    }
    if (prevProps.vertices !== this.props.vertices) {
      this.updateVertices(
        getAddedOrRemovedItems(prevProps.vertices, this.props.vertices)
      );
    }
  }

  handleStop = dragEndEvent => {
    this.props.onAction({
      type: "ITEM_DRAGGED",
      payload: {
        vertexEl: dragEndEvent.el,
        finalPos: dragEndEvent.finalPos
      }
    });
  };

  makeVerticesDraggable(vertices) {
    vertices.map(vertex => {
      this.plumbInstance.draggable(vertex.id, {
        stop: this.handleStop
      });
    });
  }

  updateConnections({ itemsAdded, itemsRemoved }) {
    this.removeConnectionsAndEndpoints(itemsRemoved);
    this.addConnectionsAndEndpoints(itemsAdded);
  }

  updateVertices({ itemsAdded, itemsRemoved }) {
    this.makeVerticesDraggable(itemsAdded);
  }

  removeConnectionsAndEndpoints = (removedConnections = []) => {
    removedConnections
      .map(connection => this.plumbConnections[connection.id])
      .forEach(connection => {
        const connectionEndpoints = connection.endpoints;
        this.plumbInstance.deleteConnection(connection);
        this.plumbInstance.deleteEndpoint(connectionEndpoints[0]);
        this.plumbInstance.deleteEndpoint(connectionEndpoints[1]);
      });
  };

  addConnectionsAndEndpoints = (addedEdges = []) => {
    addedEdges.forEach(edge => {
      const sourceEndpoint = this.plumbInstance.addEndpoint(edge.sourceId, {
          ...(edge.sourceEndpointStyles || this.props.sourceEndpointStyles),
          ...(edge.sourceEndpointOptions || this.props.sourceEndpointOptions),
          isSource: true
        }),
        targetEndpoint = this.plumbInstance.addEndpoint(edge.targetId, {
          ...(edge.targetEndpointStyles || this.props.targetEndpointStyles),
          ...(edge.targetEndpointOptions || this.props.targetEndpointOptions),
          isTarget: true
        });

      this.plumbConnections[edge.id] = this.plumbInstance.connect({
        ...(edge.styles || this.props.edgeStyles),
        ...(edge.options || this.props.edgeOptions),
        source: sourceEndpoint,
        target: targetEndpoint,
        overlays: [["Label", { label: edge.name }]]
      });
    });
  };

  drawConnections() {
    this.addConnectionsAndEndpoints(this.props.edges);
  }

  render() {
    return null;
  }
}

Edges.displayName = "Edges";
Edges.propTypes = {};
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
