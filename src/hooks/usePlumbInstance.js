// Libraries
import * as React from "react";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect
} from "react";
import { jsPlumb } from "jsplumb";
import usePrevious from "react-use/lib/usePrevious";

// Helpers
import { getAddedOrRemovedItems, getOverlays } from "../helper";

// Constants
import { PLUMB_INSTANCE_INITIAL_STATE } from "../constants";

const usePlumbInstance = props => {
  const prevVertices = usePrevious(props.vertices);
  const prevEdges = usePrevious(props.edges);
  const [state, setState] = useState(PLUMB_INSTANCE_INITIAL_STATE);
  const plumbInstanceRef = useRef();
  const plumbConnectionsRef = useRef();

  const {
    sourceEndpointStyles,
    sourceEndpointOptions,
    targetEndpointStyles,
    targetEndpointOptions,
    edgeStyles,
    edgeOptions,
    draggableOptions,
    droppableOptions,
    areVerticesDraggable,
    onAction
  } = props;

  const addConnectionsAndEndpoints = useCallback(
    (addedEdges = []) => {
      addedEdges.forEach(edge => {
        const { sourceId, targetId } = edge;
        const sourceEndpoint = plumbInstanceRef.current.addEndpoint(sourceId, {
            ...(edge.sourceEndpointStyles || sourceEndpointStyles),
            ...(edge.sourceEndpointOptions || sourceEndpointOptions),
            isSource: true
          }),
          targetEndpoint = plumbInstanceRef.current.addEndpoint(targetId, {
            ...(edge.targetEndpointStyles || targetEndpointStyles),
            ...(edge.targetEndpointOptions || targetEndpointOptions),
            isTarget: true
          });

        plumbConnectionsRef.current[edge.id] = plumbInstanceRef.current.connect(
          {
            ...(edge.styles || edgeStyles),
            ...(edge.options || edgeOptions),
            source: sourceEndpoint,
            target: targetEndpoint,
            overlays: getOverlays(edge)
          }
        );
      });
    },
    [
      sourceEndpointStyles,
      sourceEndpointOptions,
      targetEndpointStyles,
      targetEndpointOptions,
      edgeStyles,
      edgeOptions
    ]
  );

  const removeConnectionsAndEndpoints = useCallback((removedEdges = []) => {
    removedEdges.forEach(edge => {
      const connection = plumbConnectionsRef.current[edge.id];
      const connectionEndpoints = connection.endpoints;

      plumbInstanceRef.current.deleteConnection(connection);
      plumbInstanceRef.current.deleteEndpoint(connectionEndpoints[0]);
      plumbInstanceRef.current.deleteEndpoint(connectionEndpoints[1]);
    });
  }, []);

  const drawConnections = useCallback(() => {
    addConnectionsAndEndpoints(props.edges);
    setState({ overlayEdges: props.edges });
  }, [addConnectionsAndEndpoints, setState, props.edges]);

  const handleStop = useCallback(
    dragEndEvent => {
      onAction({
        type: "ITEM_DRAGGED",
        payload: {
          vertexEl: dragEndEvent.el,
          finalPos: dragEndEvent.finalPos
        }
      });
    },
    [onAction]
  );

  const handleDrop = useCallback(
    dropEndEvent => {
      onAction({
        type: "ITEM_DROPPED",
        payload: {
          dropEndEvent
        }
      });
    },
    [onAction]
  );

  const makeVerticesDraggable = useCallback(
    vertices => {
      vertices.forEach(vertex => {
        plumbInstanceRef.current.draggable(vertex.id, {
          ...draggableOptions,
          stop: handleStop
        });
        if (
          !plumbInstanceRef.current
            .getElement(vertex.id)
            .classList.contains("jtk-droppable")
        ) {
          plumbInstanceRef.current.droppable(vertex.id, {
            ...droppableOptions,
            drop: handleDrop
          });
        }
      });
    },
    [draggableOptions, droppableOptions, handleStop, handleDrop]
  );

  const updateConnections = useCallback(
    ({ itemsAdded, itemsRemoved }) => {
      removeConnectionsAndEndpoints(itemsRemoved);
      addConnectionsAndEndpoints(itemsAdded);
      setState({ overlayEdges: props.edges });
    },
    [
      removeConnectionsAndEndpoints,
      addConnectionsAndEndpoints,
      setState,
      props.edges
    ]
  );

  const unmanageVertices = useCallback((verticesRemoved, verticesUpdated) => {
    verticesRemoved.map(vertex => {
      plumbInstanceRef.current.unmanage(vertex.id);
    });
    verticesUpdated.map(vertex => {
      plumbInstanceRef.current.destroyDraggable(vertex.id);
    });
  }, []);

  const updateVertices = useCallback(
    ({ itemsAdded, itemsRemoved, itemsUpdated }) => {
      unmanageVertices(itemsRemoved, itemsUpdated);
      if (areVerticesDraggable) {
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
        plumbInstanceRef.current.updateOffset({
          elId: vertex.id,
          recalc: true
        });
      });
    },
    [unmanageVertices, areVerticesDraggable, makeVerticesDraggable]
  );

  useEffect(() => {
    jsPlumb.ready(() => {
      plumbInstanceRef.current = jsPlumb.getInstance(props.containerEl);
      props.plumbInstanceRef.current = plumbInstanceRef.current;
      plumbConnectionsRef.current = {};
      drawConnections();
      if (areVerticesDraggable) {
        makeVerticesDraggable(props.vertices);
      }
    });
  }, []);

  useLayoutEffect(() => {
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
