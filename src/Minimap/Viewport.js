import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { MINIMAP_WIDTH, MINIMAP_HEIGHT } from './Minimap';

const Viewport = ({ viewport, scalingFactor }) => {
  const scaledViewport = useMemo(
    () => ({
      top: viewport?.top * scalingFactor.y,
      left: viewport?.left * scalingFactor.x,
      width: Math.min(viewport.width * scalingFactor.x, MINIMAP_WIDTH),
      height: Math.min(viewport.height * scalingFactor.y, MINIMAP_HEIGHT),
    }),
    [viewport, scalingFactor]
  );

  return (
    <svg viewBox={`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`} width="100%">
      <defs>
        <mask id="mask" x="0" y="0" width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT}>
          <rect x="0" y="0" width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT} fill="#333" />
          <rect
            x={scaledViewport.left}
            y={scaledViewport.top}
            width={scaledViewport.width}
            height={scaledViewport.height}
          />
        </mask>
      </defs>
      <rect x="0" y="0" width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT} mask="url(#mask)" fillOpacity="0.7" />
    </svg>
  );
};

Viewport.propTypes = {
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

export default Viewport;
