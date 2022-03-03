import { useState, useRef, useEffect } from "react";
import { jsPlumb } from "jsplumb";
import usePrevious from "react-use/lib/usePrevious";

import { getAddedOrRemovedItems, getOverlays } from "../helper";

const DEFAULT_STATE = {
  overlayEdges: []
};

const usePlumbInstance = props => {
  const prevVertices = usePrevious(props.vertices);
  const prevEdges = usePrevious(props.edges);
  const [state, setState] = useState(DEFAULT_STATE);
  const plumbInstanceRef = useRef();
  const plumbConnectionsRef = useRef();

  const addConnectionsAndEndpoints = (addedEdges = []) => {
    addedEdges.forEach(edge => {
      const { sourceId, targetId } = edge;
      const sourceEndpoint = plumbInstanceRef.current.addEndpoint(sourceId, {
          ...(edge.sourceEndpointStyles || props.sourceEndpointStyles),
          ...(edge.sourceEndpointOptions || props.sourceEndpointOptions),
          isSource: true
        }),
        targetEndpoint = plumbInstanceRef.current.addEndpoint(targetId, {
          ...(edge.targetEndpointStyles || props.targetEndpointStyles),
          ...(edge.targetEndpointOptions || props.targetEndpointOptions),
          isTarget: true
        });

      plumbConnectionsRef.current[edge.id] = plumbInstanceRef.current.connect({
        ...(edge.styles || props.edgeStyles),
        ...(edge.options || props.edgeOptions),
        source: sourceEndpoint,
        target: targetEndpoint,
        overlays: getOverlays(edge)
      });
    });
  };

  const removeConnectionsAndEndpoints = (removedEdges = []) => {
    removedEdges.forEach(edge => {
      const connection = plumbConnectionsRef.current[edge.id];
      const connectionEndpoints = connection.endpoints;

      plumbInstanceRef.current.deleteConnection(connection);
      plumbInstanceRef.current.deleteEndpoint(connectionEndpoints[0]);
      plumbInstanceRef.current.deleteEndpoint(connectionEndpoints[1]);
    });
  };

  const drawConnections = () => {
    addConnectionsAndEndpoints(props.edges);
    setState({ overlayEdges: props.edges });
  };

  const handleStop = dragEndEvent => {
    props.onAction({
      type: "ITEM_DRAGGED",
      payload: {
        vertexEl: dragEndEvent.el,
        finalPos: dragEndEvent.finalPos
      }
    });
  };

  const handleDrop = dropEndEvent => {
    props.onAction({
      type: "ITEM_DROPPED",
      payload: {
        dropEndEvent
      }
    });
  };

  const makeVerticesDraggable = vertices => {
    vertices.forEach(vertex => {
      plumbInstanceRef.current.draggable(vertex.id, {
        ...props.draggableOptions,
        stop: handleStop
      });
      if (
        !plumbInstanceRef.current
          .getElement(vertex.id)
          .classList.contains("jtk-droppable")
      ) {
        plumbInstanceRef.current.droppable(vertex.id, {
          ...props.droppableOptions,
          drop: handleDrop
        });
      }
    });
  };

  const updateConnections = ({ itemsAdded, itemsRemoved }) => {
    removeConnectionsAndEndpoints(itemsRemoved);
    addConnectionsAndEndpoints(itemsAdded);
    setState({ overlayEdges: props.edges });
  };

  const unmanageVertices = (verticesRemoved, verticesUpdated) => {
    verticesRemoved.map(vertex => {
      plumbInstanceRef.current.unmanage(vertex.id);
    });
    verticesUpdated.map(vertex => {
      plumbInstanceRef.current.destroyDraggable(vertex.id);
    });
  };

  const updateVertices = ({ itemsAdded, itemsRemoved, itemsUpdated }) => {
    unmanageVertices(itemsRemoved, itemsUpdated);
    if (props.areVerticesDraggable) {
      makeVerticesDraggable(itemsAdded);
    } else {
      /*
       * plumbInstance.draggable manages vertices internally
       * Since we cannot make a vertex draggable here, so added the following code to manage them
       **/
      itemsAdded.map(vertex => {
        plumbInstanceRef.current.manage(
          vertex.id,
          plumbInstanceRef.current.getElement(vertex.id)
        );
      });
    }

    /*
     * plumbInstance.manage utility doesn't recalculate the offsets
     * Whenever an element is updated forcefully from external changes, we need to recalculate
     **/
    itemsAdded.map(vertex => {
      plumbInstanceRef.current.updateOffset({ elId: vertex.id, recalc: true });
    });
  };

  useEffect(() => {
    jsPlumb.ready(() => {
      plumbInstanceRef.current = jsPlumb.getInstance(props.containerEl);
      props.plumbInstanceRef.current = plumbInstanceRef.current;
      plumbConnectionsRef.current = {};
      drawConnections();
      if (props.areVerticesDraggable) {
        makeVerticesDraggable(props.vertices);
      }
    });
  }, []);

  useEffect(() => {
    if (prevVertices && prevVertices !== props.vertices) {
      updateVertices(getAddedOrRemovedItems(prevVertices, props.vertices));
    }
    if (prevEdges && prevEdges !== props.edges) {
      updateConnections(getAddedOrRemovedItems(prevEdges, props.edges));
    }
  });

  return {
    overlayEdges: state.overlayEdges
  };
};

export default usePlumbInstance;
