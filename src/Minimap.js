import React from 'react';
import { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import MinimapNode from './MinimapNode';
import MinimapViewport from './MinimapViewport';

const MINIMAP_WIDTH = 350;
const MINIMAP_HEIGHT = 250;
const MINIMAP_STYLE = {
  boxSizing: 'content-box',
  width: `${MINIMAP_WIDTH}px`,
  height: `${MINIMAP_HEIGHT}px`,
  border: '2px solid black',
  backgroundColor: 'rgba(20, 20, 20, 0.04)',
  position: 'fixed',
  bottom: '20px',
  left: '20px',
};

const Minimap = ({ vertices, extremeX, extremeY, viewport, changeScrollHandler }) => {
  const scalingFactor = {
    x: MINIMAP_WIDTH / extremeX,
    y: MINIMAP_HEIGHT / extremeY,
  };

  const ref = useRef(null);
  const element = ref.current;

  const handleClick = event => {
    const newScrollPosition = {
      scrollLeft: (event.clientX - element.offsetLeft - (viewport.width * scalingFactor.x) / 2) / scalingFactor.x,
      scrollTop: (event.clientY - element.offsetTop - (viewport.height * scalingFactor.y) / 2) / scalingFactor.y,
    };
    changeScrollHandler(newScrollPosition);
  };

  const el = document.getElementById('minimap-root');

  return el
    ? ReactDOM.createPortal(
        <div className="minimap" ref={ref} style={MINIMAP_STYLE} onClick={e => handleClick(e)}>
          <MinimapNode vertices={vertices} scalingFactor={scalingFactor} />
          <MinimapViewport viewport={viewport} scalingFactor={scalingFactor} />
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
