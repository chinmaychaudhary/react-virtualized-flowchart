import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const Nodes = ({ vertices, scalingFactor }) => {
  const nodes = useMemo(
    () =>
      vertices.map(vertex => ({
        id: vertex.id,
        top: vertex.top * scalingFactor.y,
        left: vertex.left * scalingFactor.x,
        width: vertex.width * scalingFactor.x,
        height: vertex.height * scalingFactor.y,
      })),
    [vertices, scalingFactor.x, scalingFactor.y]
  );

  return nodes.map(node => (
    <canvas
      key={node.id}
      style={{
        boxSizing: 'border-box',
        position: 'absolute',
        top: `${node.top}px`,
        left: `${node.left}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
        border: '1px solid rgba(20, 20, 20, 0.4)',
      }}
    />
  ));
};

Nodes.propTypes = {
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      left: PropTypes.number,
      top: PropTypes.number,
    })
  ),
  scalingFactor: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

export default Nodes;
