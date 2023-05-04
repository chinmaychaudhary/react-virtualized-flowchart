import * as React from 'react';

import { usePanAndZoom } from './hooks/usePanAndZoom';

const STYLES = {
  height: '100%',
  width: '100%',
};

const PanAndZoomContainer = ({ children, handleScroll, containerRef, scroll, contentSpan, renderControlPanel }) => {
  const {
    zoom,
    panZoomHandlers,
    combinedRef,
    diagramContainerRef,
    incrementZoom,
    decrementZoom,
    resetZoom,
  } = usePanAndZoom({ containerRef, scroll, contentSpan });

  return (
    <div style={{ ...STYLES, position: 'relative' }}>
      <div style={STYLES}>
        <div
          style={{ ...STYLES, overflow: 'auto' }}
          onScroll={handleScroll}
          ref={combinedRef}
          {...panZoomHandlers}
          className="diagramContainer"
          data-zoom={zoom}
        >
          <div
            ref={diagramContainerRef}
            style={{
              ...STYLES,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            {children({ zoom })}
          </div>
        </div>
      </div>
      {renderControlPanel({
        zoom,
        incrementZoom,
        decrementZoom,
        resetZoom,
      })}
    </div>
  );
};

export default PanAndZoomContainer;
