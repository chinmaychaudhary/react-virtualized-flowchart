import React from 'react';
import memoizeOne from 'memoize-one';
import _throttle from 'lodash/throttle';


import createIntervalTree from './lib/intervalTree';

const MARGIN = 100;

const CONTAINER_HEIGHT = 600;
const CONTAINER_WIDTH = 800;

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
 const xVerticesMap = new Map();
 const yVerticesMap = new Map();
 const visibleVertices = [];
 xIntervalTree.queryInterval(viewport.xMin, viewport.xMax, ([low, high, vertex]) => {
  xVerticesMap.set(vertex.id, vertex);
 });
 yIntervalTree.queryInterval(viewport.yMin, viewport.yMax, ([low, high, vertex]) => {
  yVerticesMap.set(vertex.id, vertex);
 });

 xVerticesMap.forEach((vertex, id) => {
  if (yVerticesMap.has(id)) {
   visibleVertices.push(vertex);
  }
 });

 return visibleVertices;
});

class DiagramTest extends React.PureComponent {

 constructor(props) {
  super(props);
  this.state = {
   viewport: {
    xMin: 0,
    xMax: CONTAINER_WIDTH,
    yMin: 0,
    yMax: CONTAINER_HEIGHT,
   },
  };
  this.initIntervalTrees();
 }

 initIntervalTrees() {
  this.xIntervalTree = createIntervalTree();
  this.yIntervalTree = createIntervalTree();
  this.initXIntervalTree(this.props.vertices);
  this.initYIntervalTree(this.props.vertices);
 }

 initXIntervalTree(vertices) {
  vertices.forEach((vertex) => {
   this.xIntervalTree.insert([vertex.left, vertex.left + vertex.width, vertex]);
  });
 }

 initYIntervalTree(vertices) {
  vertices.forEach((vertex) => {
   this.yIntervalTree.insert([vertex.top, vertex.top + vertex.height, vertex]);
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

 renderVertices() {
  return this.getVisibleVertices().map(vertex => (
    <div
      key={vertex.id}
      className="vertex"
      style={{
       height: vertex.height,
       width: vertex.width,
       position: 'absolute',
       left: 0,
       top: 0,
       transform: `translate3d(${vertex.left}px, ${vertex.top}px, 0)`
      }}
    >
     {JSON.stringify(vertex)}
    </div>
  ));
 }

 render() {
  return (
    <div className="diagramContainer" onScroll={this.handleScroll} style={{height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH}}>
     {this.renderVertices()}
     {this.renderSentinel()}
    </div>
  )
 }
}

export default DiagramTest;
