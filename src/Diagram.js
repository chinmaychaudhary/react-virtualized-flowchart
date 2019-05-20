import React from "react";
import PropTypes from "prop-types";
import memoizeOne from "memoize-one";
import _throttle from "lodash/throttle";

import createIntervalTree from "./lib/intervalTree";
import Edges from "./Edges";
import { getAddedOrRemovedItems } from "./helper";

const MARGIN = 100;

const getExtremeVertices = memoizeOne(vertices => {
  return vertices.reduce(
    (res, vertex) => {
      if (res.rightMostVertex.left < vertex.left) {
        res.rightMostVertex = vertex;
      }

      if (res.bottomMostVertex.top < vertex.top) {
        res.bottomMostVertex = vertex;
      }

      return res;
    },
    { rightMostVertex: { left: -1 }, bottomMostVertex: { top: -1 } }
  );
});

const getVisibleVertices = memoizeOne(
  (vertices, viewport, xIntervalTree, yIntervalTree, version) => {
    const universalVerticesMap = new Map(vertices.map(v => [v.id, v]));
    const xVerticesMap = new Map();
    const yVerticesMap = new Map();
    const visibleVertices = new Map();
    xIntervalTree.queryInterval(
      viewport.xMin,
      viewport.xMax,
      ([low, high, vertexId]) => {
        xVerticesMap.set(vertexId, universalVerticesMap.get(vertexId));
      }
    );
    yIntervalTree.queryInterval(
      viewport.yMin,
      viewport.yMax,
      ([low, high, vertexId]) => {
        yVerticesMap.set(vertexId, universalVerticesMap.get(vertexId));
      }
    );

    xVerticesMap.forEach((vertex, id) => {
      if (yVerticesMap.has(id)) {
        visibleVertices.set(id, vertex);
      }
    });

    return visibleVertices;
  }
);

function addEdge(vToEMap, edge, vertexId) {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList.push(edge);
  } else {
    vToEMap.set(vertexId, [edge]);
  }
}

function removeEdge(vToEMap, edgeId, vertexId) {
  let sourceVertexEdgeList = vToEMap.get(vertexId);
  if (sourceVertexEdgeList) {
    sourceVertexEdgeList = sourceVertexEdgeList.filter(
      presentEdge => presentEdge.id !== edgeId
    );
  }
  if (!sourceVertexEdgeList || !sourceVertexEdgeList.length) {
    vToEMap.delete(vertexId);
  } else {
    vToEMap.set(vertexId, sourceVertexEdgeList);
  }
}

function getRelevantEdgesAndMissedVertices(
  visibleVerticesMap,
  vToEMap,
  vertices
) {
  const universalVerticesMap = new Map(vertices.map(v => [v.id, v]));
  return [...visibleVerticesMap.values()].reduce(
    (res, vertex) => {
      const vEdgeList = vToEMap.get(vertex.id) || [];
      vEdgeList.forEach(edge => {
        res.edges.set(edge.id, edge);
        if (!visibleVerticesMap.has(edge.sourceId)) {
          res.missedVertices.set(
            edge.sourceId,
            universalVerticesMap.get(edge.sourceId)
          );
        }
        if (!visibleVerticesMap.has(edge.targetId)) {
          res.missedVertices.set(
            edge.targetId,
            universalVerticesMap.get(edge.targetId)
          );
        }
      });
      return res;
    },
    { edges: new Map(), missedVertices: new Map() }
  );
}

const getViewport = memoizeOne(
  (scrollLeft, scrollTop, clientWidth, clientHeight) => ({
    xMin: scrollLeft,
    xMax: scrollLeft + clientWidth,
    yMin: scrollTop,
    yMax: scrollTop + clientHeight
  })
);

function removeNode(intervalTree, intervalTreeNodes, nodeId) {
  intervalTree.remove(intervalTreeNodes[nodeId]);
  delete intervalTreeNodes[nodeId];
}

class Diagram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scroll: {
        left: 0,
        top: 0
      },
      container: {
        height: 0,
        width: 0
      },
      version: 0,
      isContainerElReady: false
    };
    this.vertices = props.vertices;
    this.containerRef = React.createRef();
    this.initIntervalTrees();
    this.initVerticesToEdgesMap(props.vertices, props.edges);
  }

  componentDidMount() {
    const { height, width } = this.containerRef.current.getBoundingClientRect();

    this.setState({
      container: {
        height,
        width
      },
      isContainerElReady: true
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let shouldTriggerRender = false;
    if (prevProps.vertices !== this.props.vertices) {
      this.vertices = this.props.vertices;
      this.updateIntervalTrees(
        getAddedOrRemovedItems(prevProps.vertices, this.props.vertices)
      );
      shouldTriggerRender = true;
    }
    if (prevProps.edges !== this.props.edges) {
      this.updateEdges(
        getAddedOrRemovedItems(prevProps.edges, this.props.edges)
      );
      shouldTriggerRender = true;
    }
    if (shouldTriggerRender) {
      this.setState(({ version }) => ({ version: version + 1 }));
    }
  }

  addToXIntervalTree = vertex => {
    const interval = [vertex.left, vertex.left + vertex.width, vertex.id];
    this.xIntervalTreeNodes[vertex.id] = interval;
    this.xIntervalTree.insert(interval);
  };

  addToYIntervalTree = vertex => {
    const interval = [vertex.top, vertex.top + vertex.height, vertex.id];
    this.yIntervalTreeNodes[vertex.id] = interval;
    this.yIntervalTree.insert(interval);
  };

  initIntervalTrees() {
    this.initXIntervalTree(this.props.vertices);
    this.initYIntervalTree(this.props.vertices);
  }

  initXIntervalTree(vertices) {
    this.xIntervalTree = createIntervalTree();
    this.xIntervalTreeNodes = {};
    vertices.forEach(this.addToXIntervalTree);
  }

  initYIntervalTree(vertices) {
    this.yIntervalTree = createIntervalTree();
    this.yIntervalTreeNodes = {};
    vertices.forEach(this.addToYIntervalTree);
  }

  initVerticesToEdgesMap(vertices, edges) {
    this.verticesToEdgesMap = edges.reduce((vToEMap, edge) => {
      addEdge(vToEMap, edge, edge.sourceId);
      addEdge(vToEMap, edge, edge.targetId);
      return vToEMap;
    }, new Map());
  }

  addEdgeToVerticesToEdgesMap = edge => {
    addEdge(this.verticesToEdgesMap, edge, edge.sourceId);
    addEdge(this.verticesToEdgesMap, edge, edge.targetId);
  };

  removeEdgeFromVerticesToEdgesMap = edge => {
    removeEdge(this.verticesToEdgesMap, edge.id, edge.sourceId);
    removeEdge(this.verticesToEdgesMap, edge.id, edge.targetId);
  };

  updateIntervalTrees({ itemsAdded, itemsRemoved }) {
    itemsRemoved.forEach(vertex => {
      const vertexId = vertex.id;
      removeNode(this.xIntervalTree, this.xIntervalTreeNodes, vertexId);
      removeNode(this.yIntervalTree, this.yIntervalTreeNodes, vertexId);
    });
    itemsAdded.forEach(vertex => {
      this.addToXIntervalTree(vertex);
      this.addToYIntervalTree(vertex);
    });
  }

  updateEdges({ itemsAdded, itemsRemoved }) {
    itemsRemoved.forEach(this.removeEdgeFromVerticesToEdgesMap);
    itemsAdded.forEach(this.addEdgeToVerticesToEdgesMap);
  }

  updateScroll = _throttle(target => {
    this.setState({
      scroll: {
        left: target.scrollLeft,
        top: target.scrollTop
      }
    });
  }, 0);

  handleScroll = e => {
    this.updateScroll(e.target);
  };

  getVisibleVertices() {
    const { scroll, container, version } = this.state;

    return getVisibleVertices(
      this.vertices,
      getViewport(scroll.left, scroll.top, container.width, container.height),
      this.xIntervalTree,
      this.yIntervalTree,
      version
    );
  }

  renderSentinel() {
    const { rightMostVertex, bottomMostVertex } = getExtremeVertices(
      this.vertices
    );
    const sentinelX = rightMostVertex.left + rightMostVertex.width + MARGIN;
    const sentinelY = bottomMostVertex.top + bottomMostVertex.width + MARGIN;

    return (
      <div
        style={{
          height: 1,
          width: 1,
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${sentinelX}px, ${sentinelY}px, 0)`
        }}
      />
    );
  }

  renderVertices(vertices) {
    return vertices.map((vertex, index) => (
      <React.Fragment key={vertex.id}>
        {this.props.renderVertex({ vertex, index })}
      </React.Fragment>
    ));
  }

  renderEdges(edgesMap, vertices) {
    if (!this.state.isContainerElReady) {
      return null;
    }

    return (
      <Edges
        onAction={this.props.onAction}
        edges={[...edgesMap.values()]}
        vertices={vertices}
        containerEl={this.containerRef.current}
      />
    );
  }

  render() {
    const visibleVerticesMap = this.getVisibleVertices();
    const { edges, missedVertices } = getRelevantEdgesAndMissedVertices(
      visibleVerticesMap,
      this.verticesToEdgesMap,
      this.vertices
    );
    const vertices = [
      ...visibleVerticesMap.values(),
      ...missedVertices.values()
    ];

    return (
      <div
        ref={this.containerRef}
        className="diagramContainer full-height"
        onScroll={this.handleScroll}
      >
        {this.renderVertices(vertices)}
        {this.renderEdges(edges, vertices)}
        {this.renderSentinel()}
      </div>
    );
  }
}

Diagram.propTypes = {
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      left: PropTypes.number,
      top: PropTypes.number
    })
  )
};

Diagram.defaultProps = {
  edges: []
};

export default Diagram;
