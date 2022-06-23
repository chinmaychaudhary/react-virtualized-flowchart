import React, { useCallback, useMemo } from 'react';
import { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Nodes from './Nodes';
import Viewport from './Viewport';

const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 150;
const MINIMAP_STYLE = {
  boxSizing: 'content-box',
  width: `${MINIMAP_WIDTH}px`,
  height: `${MINIMAP_HEIGHT}px`,
  backgroundColor: 'rgba(240, 240, 240, 1)',
  position: 'fixed',
  bottom: '20px',
  left: '20px',
};

const Minimap = ({ vertices, extremeX, extremeY, viewport, changeScrollHandler }) => {
  const scalingFactor = useMemo(
    () => ({
      x: MINIMAP_WIDTH / extremeX,
      y: MINIMAP_HEIGHT / extremeY,
    }),
    [extremeX, extremeY]
  );

  const containerRef = useRef(null);

  const handleClick = useCallback(
    event => {
      const newScrollPosition = {
        scrollLeft:
          (event.clientX - containerRef.current.offsetLeft - (viewport.width * scalingFactor.x) / 2) / scalingFactor.x,
        scrollTop:
          (event.clientY - containerRef.current.offsetTop - (viewport.height * scalingFactor.y) / 2) / scalingFactor.y,
      };
      changeScrollHandler(newScrollPosition);
    },
    [viewport, scalingFactor]
  );

  const el = document.getElementById('minimap-root');

  return el
    ? ReactDOM.createPortal(
        <div className="minimap" ref={containerRef} style={MINIMAP_STYLE} onClick={handleClick}>
          <Nodes vertices={vertices} scalingFactor={scalingFactor} />
          <Viewport viewport={viewport} scalingFactor={scalingFactor} />
        </div>,
        el
      )
    : null;
};

Minimap.propTypes = {
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      left: PropTypes.number,
      top: PropTypes.number,
    })
  ),
  extremeX: PropTypes.number,
  extremeY: PropTypes.number,
  viewport: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  changeScrollHandler: PropTypes.func,
};

Minimap.defaultProps = {
  vertices: [],
};

export default Minimap;

export { MINIMAP_WIDTH, MINIMAP_HEIGHT };
