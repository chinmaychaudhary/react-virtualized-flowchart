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

  makeVerticesDraggable(vertices) {
    vertices.map((vertex, index) => {
      this.plumbInstance.draggable(vertex.id, {
        stop: dragEndEvent => {
          this.props.onAction({
            type: "ITEM_DRAGGED",
            payload: {
              vertexId: dragEndEvent.el.id,
              finalPos: dragEndEvent.finalPos,
              index
            }
          });
        }
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
          isSource: true,
          anchor: "Bottom",
          paintStyle: { radius: 1 },
          connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
        }),
        targetEndpoint = this.plumbInstance.addEndpoint(edge.targetId, {
          isTarget: true,
          anchor: "Top",
          paintStyle: { fill: "blue", radius: 1 },
          connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
        });

      this.plumbConnections[edge.id] = this.plumbInstance.connect({
        source: sourceEndpoint,
        target: targetEndpoint,
        paintStyle: { stroke: "black" },
        connector: ["Flowchart", { curviness: 0, cornerRadius: 20 }],
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
Edges.defaultProps = {};

export default Edges;
