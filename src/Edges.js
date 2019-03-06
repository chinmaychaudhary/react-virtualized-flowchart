import React, {PureComponent} from 'react';
import {jsPlumb} from 'jsplumb';

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

class Edges extends PureComponent {

 componentDidMount() {
  jsPlumb.ready(() => {
   this.plumbInstance = jsPlumb.getInstance(this.props.containerEl);
   this.plumbConnections = {};
   this.drawConnections();
  });
 }

 componentDidUpdate(prevProps) {
  if (prevProps.edges !== this.props.edges) {
   this.updateConnections(
     getConnectionsUpdateItem(prevProps.edges, this.props.edges)
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

 addConnectionsAndEndpoints = (addedEdges = []) => {
  addedEdges.forEach(edge => {
   const sourceEndpoint = this.plumbInstance.addEndpoint(
     edge.sourceId,
     {
      isSource: true,
      anchor: "Bottom",
      paintStyle: { radius: 1 },
      connectorPaintStyle: { stroke: "blue", strokeWidth: 0 }
     }
     ),
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
    connector: ["Flowchart", { curviness: 20 }]
   });
  });
 };

 drawConnections() {
  this.addConnectionsAndEndpoints(this.props.edges);
 };

 render() {
  return null;
 }
}

Edges.displayName = 'Edges';
Edges.propTypes = {};
Edges.defaultProps = {};

export default Edges;
