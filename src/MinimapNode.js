import React from 'react';
import PropTypes from 'prop-types';

const MinimapNode = ({ vertices, scalingFactor }) => {
  const getMinimapNodes = () => {
    return vertices.map(vertex => ({
      top: vertex.top * scalingFactor.y,
      left: vertex.left * scalingFactor.x,
      width: vertex.width * scalingFactor.x,
      height: vertex.height * scalingFactor.y,
    }));
  };

  const renderNodes = () => {
    const minimapNodes = getMinimapNodes();
    return minimapNodes.map(node => (
      <div
        key={node.id}
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          top: `${node.top}px`,
          left: `${node.left}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
          backgroundColor: 'gold',
          border: '1px solid black',
        }}
      />
    ));
  };

  return renderNodes();
};

export default MinimapNode;

MinimapNode.propTypes = {
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
