import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { MINIMAP_WIDTH, MINIMAP_HEIGHT } from './Minimap';

const MinimapViewport = ({ viewport, scalingFactor }) => {
  const minimapViewport = useMemo(
    () => ({
      top: viewport?.top * scalingFactor.y,
      left: viewport?.left * scalingFactor.x,
      width: Math.min(viewport.width * scalingFactor.x, MINIMAP_WIDTH),
      height: Math.min(viewport.height * scalingFactor.y, MINIMAP_HEIGHT),
    }),
    [viewport, scalingFactor]
  );

  return (
    <svg viewbox={`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`} width="100%">
      <defs>
        <mask id="mask" x="0" y="0" width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT}>
          <rect x="0" y="0" width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT} fill="#333" />
          <rect
            x={minimapViewport.left}
            y={minimapViewport.top}
            width={minimapViewport.width}
            height={minimapViewport.height}
          />
        </mask>
      </defs>
      <rect x="0" y="0" width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT} mask="url(#mask)" fill-opacity="0.7" />
    </svg>
  );
};

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

export default MinimapViewport;
