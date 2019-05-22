import React, { useCallback, useReducer } from "react";

import Diagram from "./Diagram";
// import {vertices, nodes} from './data/data1';
import {
  vertices as initialVertices,
  edges as initialEdges
} from "./data/dataReal";

const initialState = { initialVertices, initialEdges };

function init({ initialVertices, initialEdges }) {
  return { vertices: initialVertices, edges: initialEdges };
}

function reducer(state, action) {
  switch (action.type) {
    case "ITEM_DRAGGED": {
      const vertices = state.vertices.map(vertex =>
        vertex.id === action.payload.vertexEl.dataset.id
          ? {
              ...vertex,
              left: action.payload.finalPos[0],
              top: action.payload.finalPos[1]
            }
          : vertex
      );
      return { ...state, vertices };
    }
  }
}

function Vertex({ vertex, index }) {
  return (
    <div
      id={vertex.id}
      className="vertex"
      style={{
        height: vertex.height,
        width: vertex.width,
        position: "absolute",
        left: vertex.left,
        top: vertex.top
      }}
      data-id={vertex.id}
      data-index={index}
    >
      <span>{index}</span>
    </div>
  );
}

export default function DiagramExample() {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const renderVertex = useCallback(
    ({ vertex, index }) => <Vertex vertex={vertex} index={index} />,
    []
  );

  return (
    <Diagram
      onAction={dispatch}
      vertices={state.vertices}
      edges={state.edges}
      renderVertex={renderVertex}
    />
  );
}
