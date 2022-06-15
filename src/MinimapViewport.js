import React from 'react';
import PropTypes from 'prop-types';

import { MINIMAP_WIDTH, MINIMAP_HEIGHT } from './Minimap';

const MinimapViewport = ({ viewport, scalingFactor }) => {
  const getMinimapViewport = () => ({
    top: viewport?.top * scalingFactor.y,
    left: viewport?.left * scalingFactor.x,
    width: Math.min(viewport.width * scalingFactor.x, MINIMAP_WIDTH),
    height: Math.min(viewport.height * scalingFactor.y, MINIMAP_HEIGHT),
  });

  const minimapViewport = getMinimapViewport();

  return (
    <div
      style={{
        position: 'absolute',
        top: `${minimapViewport.top}px`,
        left: `${minimapViewport.left}px`,
        width: `${minimapViewport.width}px`,
        height: `${minimapViewport.height}px`,
        backgroundColor: 'rgba(240, 240, 240, 0.3)',
        border: '1px solid blue',
      }}
    />
  );
};

export default MinimapViewport;

MinimapViewport.propTypes = {
  viewport: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  scalingFactor: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};
