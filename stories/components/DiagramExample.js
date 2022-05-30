import React, { useCallback, useReducer } from 'react';

import Diagram from '../../src/Diagram';

function init({ initialVertices, initialEdges }) {
  return { vertices: initialVertices, edges: initialEdges };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ITEM_DRAGGED': {
      const vertices = state.vertices.map(vertex =>
        vertex.id === action.payload.vertexEl.dataset.id
          ? {
              ...vertex,
              left: action.payload.finalPos[0],
              top: action.payload.finalPos[1],
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
        position: 'absolute',
        left: vertex.left,
        top: vertex.top,
      }}
      data-id={vertex.id}
      data-index={index}
    >
      <span>{index}</span>
    </div>
  );
}

export default function DiagramExample({ initialState, enableZoom }) {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const renderVertex = useCallback(({ vertex, index }) => <Vertex vertex={vertex} index={index} />, []);
  const renderBackground = useCallback(
    (x, y) => <div className="sq-bg" style={{ height: `${y}px`, width: `${x}px` }} />,
    []
  );

  return (
    <Diagram
      onAction={dispatch}
      vertices={state.vertices}
      edges={state.edges}
      renderVertex={renderVertex}
      renderBackground={renderBackground}
      enableZoom={enableZoom}
    />
  );
}
