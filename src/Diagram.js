import React from "react";
import { jsPlumb } from "jsplumb";
import Node from "./Node";
import { keyBy } from "lodash";

function getConnectionsUpdateItem(prevConnections, nextConnections) {
  const prevMap = new Map(prevConnections.map(i => [i.id, i]));
  const nextMap = new Map(nextConnections.map(i => [i.id, i]));
  const connectionsAdded = [];
  const connectionsRemoved = [];

  prevMap.forEach((value, id) => {
    if (!nextMap.has(id)) {
      connectionsRemoved.push(value);
    }
  });

  nextMap.forEach((value, id) => {
    if (!prevMap.has(id)) {
      connectionsAdded.push(value);
    }
  });

  return {
    connectionsAdded,
    connectionsRemoved
  };
}

class Diagram extends React.PureComponent {
  containerRef = React.createRef();

  componentDidMount() {
    jsPlumb.ready(() => {
      this.plumbInstance = jsPlumb.getInstance(this.containerRef.current);
      this.plumbConnections = {};
    });
    this.drawConnections();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.connections !== this.props.connections) {
      this.updateConnections(
        getConnectionsUpdateItem(prevProps.connections, this.props.connections)
      );
    }
  }

  updateConnections({ connectionsAdded, connectionsRemoved }) {
    this.removeConnectionsAndEndpoints(connectionsRemoved);
    this.addConnectionsAndEndpoints(connectionsAdded);
  }

  removeConnectionsAndEndpoints = (deletedConnections = []) => {
    deletedConnections
      .map(connection => this.plumbConnections[connection.id])
      .forEach(connection => {
        const connectionEndpoints = connection.endpoints;
        this.plumbInstance.deleteConnection(connection);
        this.plumbInstance.deleteEndpoint(connectionEndpoints[0]);
        this.plumbInstance.deleteEndpoint(connectionEndpoints[1]);
      });
  };

  addConnectionsAndEndpoints = (addedConnections = []) => {
    addedConnections.forEach(connection => {
      const sourceEndpoint = this.plumbInstance.addEndpoint(
          connection.sourceId,
          {
            isSource: true,
            anchor: "Bottom",
            paintStyle: { radius: 1 },
            connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
          }
        ),
        targetEndpoint = this.plumbInstance.addEndpoint(connection.targetId, {
          isTarget: true,
          anchor: "Top",
          paintStyle: { fill: "blue", radius: 1 },
          connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
        });

      this.plumbConnections[connection.id] = this.plumbInstance.connect({
        source: sourceEndpoint,
        target: targetEndpoint,
        paintStyle: { stroke: "black" },
        connector: ["Flowchart", { curviness: 20 }]
      });
    });
  };

  drawConnections = () => {
    this.addConnectionsAndEndpoints(this.props.connections);
  };

  render() {
    return (
      <div
        className="diagramContainer full-height"
        ref={this.containerRef}
      >
        {this.props.nodes.map(node => (
          <Node key={node.id} node={node} />
        ))}
      </div>
    );
  }
}

export default Diagram;
