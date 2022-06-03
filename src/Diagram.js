import React from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash/throttle';
import invariant from 'invariant';

import Edges from './Edges';
import PanAndZoomContainer from './PanAndZoomContainer';

import IntervalTree from '@flatten-js/interval-tree';

import {
  getAddedOrRemovedItems,
  getXUpper,
  getYUpper,
  getExtremeVertices,
  getVerticesMap,
  getVisibleVertices,
  getVisibleEdges,
  addEdge,
  removeEdge,
  getViewport,
  removeNode,
  makeXIntervalForEdge,
  makeYIntervalForEdge,
  getResizeObserver,
} from './helper';

import { MARGIN, DEFAULT_CONTAINER_RECT, DEFAULT_ZOOM } from './constants';
class Diagram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scroll: {
        left: 0,
        top: 0,
      },
      container: {
        height: 0,
        width: 0,
      },
      version: 0,
      isContainerElReady: false,
    };
    this.containerRef = React.createRef();
    const { verticesMap } = this.setVertices(props.vertices);
    this.initVerticesToEdgesMap(props.edges);
    this.initIntervalTrees(props.edges, verticesMap);
  }

  componentDidMount() {
    const container = this.containerRef.current;
    const { height, width } = container.getBoundingClientRect();

    this.setState({
      container: {
        height,
        width,
      },
      isContainerElReady: true,
    });

    const ResizeObserver = getResizeObserver();

    this.containerResizeObserver = new ResizeObserver(([entry]) =>
      this.setState(prevState => {
        const { contentRect } = entry;
        return {
          ...prevState,
          container: {
            height: contentRect.height,
            width: contentRect.width,
          },
        };
      })
    );
    this.containerResizeObserver.observe(container);
  }

  componentWillUnmount() {
    this.containerResizeObserver.disconnect();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let shouldTriggerRender = false;
    const didVerticesChange = prevProps.vertices !== this.props.vertices;
    let { verticesMap, verticesToEdgesMap } = this;

    if (didVerticesChange) {
      verticesMap = this.setVertices(this.props.vertices).verticesMap;
    }

    if (this.revalidateNodes) {
      this.verticesToBeValidated.forEach(vertex => this.plumbInstance.revalidate(vertex.id));
      this.revalidateNodes = false;
    }

    if (prevProps.edges !== this.props.edges) {
      verticesToEdgesMap = this.updateEdges(getAddedOrRemovedItems(prevProps.edges, this.props.edges), verticesMap)
        .verticesToEdgesMap;
      shouldTriggerRender = true;
    }

    if (didVerticesChange) {
      const { itemsAdded, itemsRemoved } = getAddedOrRemovedItems(prevProps.vertices, this.props.vertices);

      this.revalidateNodes = true;
      this.verticesToBeValidated = itemsAdded;

      this.updateIntervalTrees({ itemsAdded, itemsRemoved }, verticesToEdgesMap);
      shouldTriggerRender = true;
    }

    if (shouldTriggerRender) {
      this.setState(({ version }) => ({ version: version + 1 }));
    }
  }

  setVertices(vertices) {
    this.vertices = vertices;
    this.verticesMap = getVerticesMap(vertices);
    return { vertices: this.vertices, verticesMap: this.verticesMap };
  }

  addToXIntervalTree = (edge, verticesMap) => {
    const edgeId = edge.id;
    if (this.treeNodeById[edgeId]?.xInterval) {
      return;
    }

    const sourceVertex = verticesMap.get(edge.sourceId);
    invariant(sourceVertex, `sourceVertex missing for the edgeId - ${edgeId}`);
    const targetVertex = verticesMap.get(edge.targetId);
    invariant(targetVertex, `targetVertex missing for the edgeId - ${edgeId}`);

    const interval = makeXIntervalForEdge(edge, sourceVertex.vertex, targetVertex.vertex);
    this.treeNodeById[edgeId] = {
      ...this.treeNodeById[edgeId],
      xInterval: interval,
      edge,
    };
    this.xIntervalTree.insert(interval, edgeId);
  };

  addToYIntervalTree = (edge, verticesMap) => {
    const edgeId = edge.id;

    if (this.treeNodeById[edgeId]?.yInterval) {
      return;
    }

    const sourceVertex = verticesMap.get(edge.sourceId);
    invariant(sourceVertex, `sourceVertex missing for the edgeId - ${edgeId}`);
    const targetVertex = verticesMap.get(edge.targetId);
    invariant(targetVertex, `targetVertex missing for the edgeId - ${edgeId}`);

    const interval = makeYIntervalForEdge(edge, sourceVertex.vertex, targetVertex.vertex);

    this.treeNodeById[edgeId] = {
      ...this.treeNodeById[edgeId],
      yInterval: interval,
      edge,
    };
    this.yIntervalTree.insert(interval, edgeId);
  };

  initIntervalTrees(edges, verticesMap) {
    this.treeNodeById = {};
    this.initXIntervalTree(edges, verticesMap);
    this.initYIntervalTree(edges, verticesMap);
  }

  initVerticesToEdgesMap(edges) {
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

  initXIntervalTree(edges, verticesMap) {
    this.xIntervalTree = new IntervalTree();
    edges.forEach(edge => this.addToXIntervalTree(edge, verticesMap));
  }

  initYIntervalTree(edges, verticesMap) {
    this.yIntervalTree = new IntervalTree();
    edges.forEach(edge => this.addToYIntervalTree(edge, verticesMap));
  }

  updateIntervalTrees({ itemsAdded, itemsRemoved }, verticesToEdgesMap) {
    itemsRemoved.forEach(vertex => {
      const vertexId = vertex.id;
      const edges = verticesToEdgesMap.get(vertexId) || [];
      edges.forEach(edge => {
        removeNode(this.xIntervalTree, this.yIntervalTree, this.treeNodeById, edge.id);
      });
    });
    itemsAdded.forEach(vertex => {
      const edges = verticesToEdgesMap.get(vertex.id);
      const { verticesMap } = this;
      edges.forEach(edge => {
        this.addToXIntervalTree(edge, verticesMap);
        this.addToYIntervalTree(edge, verticesMap);
      });
    });
  }

  updateEdges({ itemsAdded, itemsRemoved }, verticesMap) {
    itemsRemoved.forEach(edge => {
      const edgeId = edge.id;
      this.removeEdgeFromVerticesToEdgesMap(edge);
      removeNode(this.xIntervalTree, this.yIntervalTree, this.treeNodeById, edgeId);
    });

    itemsAdded.forEach(edge => {
      this.addEdgeToVerticesToEdgesMap(edge);
      this.addToXIntervalTree(edge, verticesMap);
      this.addToYIntervalTree(edge, verticesMap);
    });

    return { verticesToEdgesMap: this.verticesToEdgesMap };
  }

  updateScroll = _throttle(target => {
    this.setState({
      scroll: {
        left: target.scrollLeft,
        top: target.scrollTop,
      },
    });
  }, 0);

  handleScroll = e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    this.updateScroll(e.currentTarget);
  };

  getVisibleEdges(zoom, overscan) {
    const { scroll, version } = this.state;
    const { width, height } = this.containerRef.current
      ? this.containerRef.current.getBoundingClientRect()
      : DEFAULT_CONTAINER_RECT;
    const viewport = getViewport(scroll.left, scroll.top, width, height, zoom);
    const viewportWithOverscanning = {
      xMin: viewport.xMin - width,
      xMax: viewport.xMax + width,
      yMin: viewport.yMin - height,
      yMax: viewport.yMax + height,
    };

    return getVisibleEdges(
      overscan ? viewportWithOverscanning : viewport,
      this.xIntervalTree,
      this.yIntervalTree,
      this.treeNodeById,
      version
    );
  }

  getVisibleVertices(zoom, overscan) {
    const { version } = this.state;

    return getVisibleVertices(this.verticesMap, this.getVisibleEdges(zoom, overscan), version);
  }

  getExtremeXAndY() {
    const { rightMostVertex, bottomMostVertex } = getExtremeVertices(this.vertices);

    const sentinelX = getXUpper(rightMostVertex) + MARGIN;
    const sentinelY = getYUpper(bottomMostVertex) + MARGIN;

    return [sentinelX, sentinelY];
  }

  registerPlumbInstance = plumbInstance => {
    this.plumbInstance = plumbInstance;
  };

  renderSentinel(x, y) {
    return (
      <div
        style={{
          height: 1,
          width: 1,
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate3d(${x}px, ${y}px, 0)`,
        }}
      />
    );
  }

  renderBackground(x, y) {
    return this.props.renderBackground(x, y);
  }

  renderVertices(vertices, zoom) {
    return vertices.map(({ vertex, index }) => (
      <React.Fragment key={vertex.id}>{this.props.renderVertex({ vertex, index, zoom })}</React.Fragment>
    ));
  }

  renderEdges(edgesMap, vertices) {
    if (!this.state.isContainerElReady) {
      return null;
    }

    return (
      <Edges
        renderOverlays={this.props.renderOverlays}
        registerPlumbInstance={this.registerPlumbInstance}
        onAction={this.props.onAction}
        edges={[...edgesMap.values()]}
        vertices={vertices.map(v => v.vertex)}
        containerEl={this.containerRef.current}
        sourceEndpointStyles={this.props.sourceEndpointStyles}
        sourceEndpointOptions={this.props.sourceEndpointOptions}
        targetEndpointStyles={this.props.targetEndpointStyles}
        targetEndpointOptions={this.props.targetEndpointOptions}
        edgeStyles={this.props.edgeStyles}
        draggableOptions={this.props.draggableOptions}
        droppableOptions={this.props.droppableOptions}
        areVerticesDraggable={this.props.areVerticesDraggable}
      />
    );
  }

  renderChildren(extremeX, extremeY, zoom) {
    const overscan = 1;
    const verticesMap = this.getVisibleVertices(zoom, overscan);
    const edges = this.getVisibleEdges(zoom, overscan);
    const vertices2 = this.getVisibleVertices(zoom, 0);
    console.log(verticesMap, vertices2);
    const vertices = [...verticesMap.values()];

    return (
      <React.Fragment>
        {this.renderVertices(vertices, zoom)}
        {this.renderEdges(edges, vertices)}
        {this.renderSentinel(extremeX, extremeY)}
        {this.renderBackground(extremeX, extremeY)}
      </React.Fragment>
    );
  }

  render() {
    const [extremeX, extremeY] = this.getExtremeXAndY();

    if (this.props.enableZoom) {
      return (
        <PanAndZoomContainer
          handleScroll={this.handleScroll}
          containerRef={this.containerRef}
          renderPanAndZoomControls={this.props.renderPanAndZoomControls}
          scroll={this.state.scroll}
          contentSpan={{ x: extremeX, y: extremeY }}
        >
          {({ zoom }) => this.renderChildren(extremeX, extremeY, zoom)}
        </PanAndZoomContainer>
      );
    }

    return (
      <div
        style={{ height: '100%', overflow: 'auto', position: 'relative' }}
        ref={this.containerRef}
        className="diagramContainer"
        onScroll={this.handleScroll}
      >
        {this.renderChildren(extremeX, extremeY, DEFAULT_ZOOM)}
      </div>
    );
  }
}

Diagram.propTypes = {
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      left: PropTypes.number,
      top: PropTypes.number,
    })
  ),
  draggableOptions: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.number),
    consumeStartEvent: PropTypes.bool,
    getConstrainingRectangle: PropTypes.func,
    containment: PropTypes.bool,
  }),
  droppableOptions: PropTypes.shape({
    canDrop: PropTypes.func,
    hoverClass: PropTypes.string,
  }),
  enableZoom: PropTypes.bool,
  renderOverlays: PropTypes.func,
  renderBackground: PropTypes.func,
};

Diagram.defaultProps = {
  edges: [],
  enableZoom: false,
  renderBackground() {
    return null;
  },
  areVerticesDraggable: true,
  renderOverlays() {
    return null;
  },
};

export default Diagram;
