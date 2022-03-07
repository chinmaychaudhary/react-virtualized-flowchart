// Libraries
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import _throttle from "lodash/throttle";
import usePrevious from "react-use/lib/usePrevious";

// Components
import Edges from "./Edges";
import PanAndZoomContainer from "./PanAndZoomContainer";

// Hooks
import useIntervalTree from "./hooks/useIntervalTree";
import useEdgesAndVertices from "./hooks/useEdgesAndVertices";

// Helpers
import {
  getAddedOrRemovedItems,
  getXUpper,
  getYUpper,
  getExtremeVertices,
  getVisibleVerticesHelper,
  getViewport
} from "./helper";

// Constants
import {
  MARGIN,
  DEFAULT_CONTAINER_RECT,
  DIAGRAM_INITIAL_STATE
} from "./constants";

const Diagram = props => {
  const prevEdges = usePrevious(props.edges);
  const prevVertices = usePrevious(props.vertices);

  const [state, setState] = useState(DIAGRAM_INITIAL_STATE);
  const containerRef = useRef();

  const {
    vertices,
    verticesMapRef,
    verticesToEdgesMapRef,
    setVertices
  } = useEdgesAndVertices(props.edges, props.vertices);

  const {
    getVisibleEdgesHelper,
    updateIntervalTrees,
    updateEdges
  } = useIntervalTree(props.edges, verticesMapRef.current);

  const plumbInstanceRef = useRef();
  const validateNodesRef = useRef({
    revalidateNodes: false,
    verticesToBeValidated: []
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, isContainerElReady: true }));
  }, []);

  useEffect(() => {
    let shouldTriggerRender = false;
    const didVerticesChange = prevVertices && prevVertices !== props.vertices;

    if (didVerticesChange) {
      verticesMapRef.current = setVertices(props.vertices).verticesMap;
    }

    if (validateNodesRef.current.revalidateNodes) {
      validateNodesRef.current.verticesToBeValidated.forEach(vertex =>
        plumbInstanceRef.current.revalidate(vertex.id)
      );
      validateNodesRef.current = {
        revalidateNodes: false
      };
    }

    if (prevEdges && prevEdges !== props.edges) {
      verticesToEdgesMapRef.current = updateEdges(
        getAddedOrRemovedItems(prevEdges, props.edges),
        verticesMapRef.current,
        verticesToEdgesMapRef.current
      ).verticesToEdgesMap;
      shouldTriggerRender = true;
    }

    if (didVerticesChange) {
      const { itemsAdded, itemsRemoved } = getAddedOrRemovedItems(
        prevVertices,
        props.vertices
      );

      validateNodesRef.current = {
        revalidateNodes: true,
        verticesToBeValidated: itemsAdded
      };

      updateIntervalTrees(
        { itemsAdded, itemsRemoved },
        verticesMapRef.current,
        verticesToEdgesMapRef.current
      );
      shouldTriggerRender = true;
    }

    if (shouldTriggerRender) {
      setState(prevState => ({ ...prevState, version: prevState.version + 1 }));
    }
  });

  const updateScroll = _throttle(target => {
    setState(prevState => ({
      ...prevState,
      scroll: {
        left: target.scrollLeft,
        top: target.scrollTop
      }
    }));
  }, 0);

  const handleScroll = e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    updateScroll(e.currentTarget);
  };

  const getVisibleEdges = (zoom = 1) => {
    const { scroll, version } = state;
    const { width, height } = containerRef.current
      ? containerRef.current.getBoundingClientRect()
      : DEFAULT_CONTAINER_RECT;

    const scale = 1 / zoom;
    const scrollLeft = scroll.left * scale;
    const scrollTop = scroll.top * scale;
    const containerWidth = width * scale;
    const containerHeight = height * scale;

    return getVisibleEdgesHelper(
      getViewport(scrollLeft, scrollTop, containerWidth, containerHeight)
    );
  };

  const getVisibleVertices = (zoom = 1) => {
    const { version } = state;

    return getVisibleVerticesHelper(
      verticesMapRef.current,
      getVisibleEdges(zoom),
      version
    );
  };

  const getExtremeXAndY = () => {
    const { rightMostVertex, bottomMostVertex } = getExtremeVertices(vertices);

    const sentinelX = getXUpper(rightMostVertex) + MARGIN;
    const sentinelY = getYUpper(bottomMostVertex) + MARGIN;

    return [sentinelX, sentinelY];
  };

  const renderSentinel = (x, y) => {
    return (
      <div
        style={{
          height: 1,
          width: 1,
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${x}px, ${y}px, 0)`
        }}
      />
    );
  };

  const renderBackground = (x, y) => {
    return props.renderBackground(x, y);
  };

  const renderVertices = (vertices, zoom) => {
    return vertices.map(({ vertex, index }) => (
      <React.Fragment key={vertex.id}>
        {props.renderVertex({ vertex, index, zoom })}
      </React.Fragment>
    ));
  };

  const renderEdges = (edgesMap, vertices) => {
    if (!state.isContainerElReady) {
      return null;
    }

    return (
      <Edges
        renderOverlays={props.renderOverlays}
        plumbInstanceRef={plumbInstanceRef}
        onAction={props.onAction}
        edges={[...edgesMap.values()]}
        vertices={vertices.map(v => v.vertex)}
        containerEl={containerRef.current}
        sourceEndpointStyles={props.sourceEndpointStyles}
        sourceEndpointOptions={props.sourceEndpointOptions}
        targetEndpointStyles={props.targetEndpointStyles}
        targetEndpointOptions={props.targetEndpointOptions}
        edgeStyles={props.edgeStyles}
        draggableOptions={props.draggableOptions}
        droppableOptions={props.droppableOptions}
        areVerticesDraggable={props.areVerticesDraggable}
      />
    );
  };

  const renderChildren = (edges, vertices, extremeX, extremeY, zoom = 1) => {
    return (
      <>
        {renderVertices(vertices, zoom)}
        {renderEdges(edges, vertices)}
        {renderSentinel(extremeX, extremeY)}
        {renderBackground(extremeX, extremeY)}
      </>
    );
  };

  if (props.enableZoom) {
    return (
      <PanAndZoomContainer
        handleScroll={handleScroll}
        containerRef={containerRef}
        renderPanAndZoomControls={props.renderPanAndZoomControls}
        scroll={state.scroll}
      >
        {({ zoom }) => {
          const visibleVerticesMap = getVisibleVertices(zoom);
          const edges = getVisibleEdges(zoom);

          const visibleVertices = [...visibleVerticesMap.values()];
          const [extremeX, extremeY] = getExtremeXAndY();

          return (
            <>
              {renderChildren(edges, visibleVertices, extremeX, extremeY, zoom)}
            </>
          );
        }}
      </PanAndZoomContainer>
    );
  }

  const visibleVerticesMap = getVisibleVertices();
  const edges = getVisibleEdges();

  const visibleVertices = [...visibleVerticesMap.values()];
  const [extremeX, extremeY] = getExtremeXAndY();

  return (
    <div
      style={{ height: "100%", overflow: "auto", position: "relative" }}
      ref={containerRef}
      className="diagramContainer"
      onScroll={handleScroll}
    >
      {renderChildren(edges, visibleVertices, extremeX, extremeY)}
    </div>
  );
};

Diagram.propTypes = {
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      left: PropTypes.number,
      top: PropTypes.number
    })
  ),
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
  enableZoom: PropTypes.bool,
  renderOverlays: PropTypes.func,
  renderBackground: PropTypes.func
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
  }
};

export default Diagram;
