import React from 'react';
import memoizeOne from 'memoize-one';
import _throttle from 'lodash/throttle';


import createIntervalTree from './lib/intervalTree';
import Edges from './Edges';
import {getAddedOrRemovedItems} from './helper';

const MARGIN = 100;

const CONTAINER_HEIGHT = window.innerHeight;
const CONTAINER_WIDTH = window.innerWidth;

const getExtremeVertices = memoizeOne((vertices) => {
 return vertices.reduce((res, vertex) => {
  if (res.rightMostVertex.left < vertex.left) {
   res.rightMostVertex = vertex;
  }

  if (res.bottomMostVertex.top < vertex.top) {
   res.bottomMostVertex = vertex;
  }

  return res;
 }, { rightMostVertex: { left: -1 }, bottomMostVertex: { top: -1 } });
});

const getVisibleVertices = memoizeOne((vertices, viewport, xIntervalTree, yIntervalTree) => {
 const universalVerticesMap = new Map(vertices.map(v => [v.id, v]));
 const xVerticesMap = new Map();
 const yVerticesMap = new Map();
 const visibleVertices = new Map();
 xIntervalTree.queryInterval(viewport.xMin, viewport.xMax, ([low, high, vertexId]) => {
  xVerticesMap.set(vertexId, universalVerticesMap.get(vertexId));
 });
 yIntervalTree.queryInterval(viewport.yMin, viewport.yMax, ([low, high, vertexId]) => {
  yVerticesMap.set(vertexId, universalVerticesMap.get(vertexId));
 });

 xVerticesMap.forEach((vertex, id) => {
  if (yVerticesMap.has(id)) {
   visibleVertices.set(id, vertex);
  }
 });

 return visibleVertices;
});

function addEdge(vToEMap, edge, vertexId) {
 let sourceVertexEdgeList = vToEMap.get(vertexId);
 if (sourceVertexEdgeList) {
  sourceVertexEdgeList.push(edge)
 } else {
  vToEMap.set(vertexId, [edge]);
 }
}

function getRelevantEdgesAndMissedVertices(visibleVerticesMap, vToEMap, vertices) {
 const universalVerticesMap = new Map(vertices.map(v => [v.id, v]));
 return [...visibleVerticesMap.values()].reduce((res, vertex) => {
  const vEdgeList = vToEMap.get(vertex.id) || [];
  vEdgeList.forEach(edge => {
   res.edges.set(edge.id, edge);
   if (!visibleVerticesMap.has(edge.sourceId)) {
    res.missedVertices.set(edge.sourceId, universalVerticesMap.get(edge.sourceId));
   }
   if (!visibleVerticesMap.has(edge.targetId)) {
    res.missedVertices.set(edge.targetId, universalVerticesMap.get(edge.targetId));
   }
  });
  return res;
 }, { edges: new Map(), missedVertices: new Map() })
}

class Diagram extends React.PureComponent {

 constructor(props) {
  super(props);
  this.state = {
   viewport: {
    xMin: 0,
    xMax: CONTAINER_WIDTH,
    yMin: 0,
    yMax: CONTAINER_HEIGHT,
   },
   version: 0,
   isContainerElReady: false,
  };
  this.containerRef = React.createRef();
  this.initIntervalTrees();
  this.initVerticesToEdgesMap(props.vertices, props.edges);
 }

 componentDidMount() {
  this.setState({ isContainerElReady: true });
 }

 componentDidUpdate(prevProps, prevState, snapshot) {
  if (prevProps.vertices !== this.props.vertices) {
   this.updateIntervalTrees(
     getAddedOrRemovedItems(prevProps.vertices, this.props.vertices)
   );
   this.setState(({ version }) => ({ version: version + 1 }));
  }
 }

 initIntervalTrees() {
  this.initXIntervalTree(this.props.vertices);
  this.initYIntervalTree(this.props.vertices);
 }

 initXIntervalTree(vertices) {
  this.xIntervalTree = createIntervalTree();
  this.xIntervalTreeNodes = {};
  vertices.forEach((vertex) => {
   const interval = [vertex.left, vertex.left + vertex.width, vertex.id];
   this.xIntervalTreeNodes[vertex.id] = interval;
   this.xIntervalTree.insert(interval);
  });
 }

 initYIntervalTree(vertices) {
  this.yIntervalTree = createIntervalTree();
  this.yIntervalTreeNodes = {};
  vertices.forEach((vertex) => {
   const interval = [vertex.top, vertex.top + vertex.height, vertex.id];
   this.yIntervalTreeNodes[vertex.id] = interval;
   this.yIntervalTree.insert(interval);
  });
 }

 initVerticesToEdgesMap(vertices, edges) {
  this.verticesToEdgesMap = edges.reduce((vToEMap, edge) => {
   addEdge(vToEMap, edge, edge.sourceId);
   addEdge(vToEMap, edge, edge.targetId);
   return vToEMap;
  }, new Map());
 }

 updateIntervalTrees({ itemsAdded, itemsRemoved }) {
  itemsRemoved.forEach(vertex => {
   this.xIntervalTree.remove(this.xIntervalTreeNodes[vertex.id]);
   this.yIntervalTree.remove(this.yIntervalTreeNodes[vertex.id]);
   delete this.xIntervalTreeNodes[vertex.id];
   delete this.yIntervalTreeNodes[vertex.id]
  });
  itemsAdded.forEach(vertex => {
   const xInterval = [vertex.left, vertex.left + vertex.width, vertex.id];
   this.xIntervalTreeNodes[vertex.id] = xInterval;
   this.xIntervalTree.insert(xInterval);
   const yInterval = [vertex.top, vertex.top + vertex.height, vertex.id];
   this.yIntervalTreeNodes[vertex.id] = yInterval;
   this.yIntervalTree.insert(yInterval);
  });
 }

 updateViewport = _throttle(target => {
  this.setState({
   viewport: {
    xMin: target.scrollLeft,
    xMax: target.scrollLeft + CONTAINER_WIDTH,
    yMin: target.scrollTop,
    yMax: target.scrollTop + CONTAINER_HEIGHT,
   },
  });
 }, 0);

 handleScroll = (e) => {
  this.updateViewport(e.target);
 };

 getVisibleVertices() {
  return getVisibleVertices(
    this.props.vertices,
    this.state.viewport,
    this.xIntervalTree,
    this.yIntervalTree,
  );
 }

 renderSentinel() {
  const { rightMostVertex, bottomMostVertex } = getExtremeVertices(this.props.vertices);
  const rightSentinelX = rightMostVertex.left + rightMostVertex.width + MARGIN;
  const bottomSentinelY = bottomMostVertex.top + bottomMostVertex.width + MARGIN;

  return (
    <div style={{
     height: 1,
     width: 1,
     position: 'absolute',
     left: 0,
     top: 0,
     transform: `translate3d(${rightSentinelX}px, ${bottomSentinelY}px, 0)`
    }}/>
  );
 }

 renderVertices(vertices) {
  return vertices.map(vertex => (
    <div
      id={vertex.id}
      key={vertex.id}
      className="vertex"
      style={{
       height: vertex.height,
       width: vertex.width,
       position: 'absolute',
       left: vertex.left,
       top: vertex.top,
      }}
    >
     {JSON.stringify(vertex)}
    </div>
  ));
 }

 renderEdges(edgesMap, vertices) {
  if (!this.state.isContainerElReady) {
   return null;
  }

  return (
    <Edges onAction={this.props.onAction} edges={[...edgesMap.values()]} vertices={vertices}
      containerEl={this.containerRef.current}/>
  );
 }

 render() {
  const visibleVerticesMap = this.getVisibleVertices();
  const { edges, missedVertices } = getRelevantEdgesAndMissedVertices(visibleVerticesMap, this.verticesToEdgesMap, this.props.vertices);
  const vertices = [...visibleVerticesMap.values(), ...missedVertices.values()];

  return (
    <div ref={this.containerRef} className="diagramContainer" onScroll={this.handleScroll}
      style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}>
     {this.renderVertices(vertices)}
     {this.renderEdges(edges, vertices)}
     {this.renderSentinel()}
    </div>
  )
 }
}

Diagram.defaultProps = {
 edges: [],
};

export default Diagram;
