import React from 'react';
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const MINIMAP_WIDTH = 350;
const MINIMAP_HEIGHT = 250;

const Minimap = ({ vertices, extremeX, extremeY, viewport, changeScrollHandler, style }) => {
  const getScalingFactor = () => ({
    x: MINIMAP_WIDTH / extremeX,
    y: MINIMAP_HEIGHT / extremeY,
  });

  const getMinimapViewport = () => ({
    top: viewport.yMin * scalingFactor.y,
    left: viewport.xMin * scalingFactor.x,
    width: Math.min(viewportWidth * scalingFactor.x, MINIMAP_WIDTH),
    height: Math.min(viewportHeight * scalingFactor.y, MINIMAP_HEIGHT),
  });

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

  const ref = useRef(null);
  const scalingFactor = getScalingFactor();

  const viewportWidth = viewport.xMax - viewport.xMin;
  const viewportHeight = viewport.yMax - viewport.yMin;

  const minimapViewport = getMinimapViewport();

  useEffect(() => {
    const element = ref.current;
    const handleClick = event => {
      const newScrollPosition = {
        scrollLeft: (event.clientX - element.offsetLeft - (viewportWidth * scalingFactor.x) / 2) / scalingFactor.x,
        scrollTop: (event.clientY - element.offsetTop - (viewportHeight * scalingFactor.y) / 2) / scalingFactor.y,
      };
      changeScrollHandler(newScrollPosition);
    };

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  });

  return (
    <div
      className="minimap"
      ref={ref}
      style={{
        boxSizing: 'content-box',
        width: `${MINIMAP_WIDTH}px`,
        height: `${MINIMAP_HEIGHT}px`,
        ...style,
      }}
    >
      {renderNodes()}
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
      ></div>
    </div>
  );
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
    xMin: PropTypes.number,
    xMax: PropTypes.number,
    yMin: PropTypes.number,
    yMax: PropTypes.number,
  }),
  changeScrollHandler: PropTypes.func,
  style: PropTypes.object,
};

Minimap.defaultProps = {
  vertices: [],
  style: PropTypes.shape({
    border: '2px solid black',
    backgroundColor: 'rgba(20, 20, 20, 0.04)',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  }),
};

export default Minimap;
