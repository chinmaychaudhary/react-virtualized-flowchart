import * as React from 'react';

import { usePanAndZoom } from './hooks/usePanAndZoom';
import { ZoomContext } from './zoomContext';

const STYLES = {
  height: '100%',
  width: '100%',
};

const PanAndZoomContainer = ({
  children,
  handleScroll,
  containerRef,
  scroll,
  contentSpan,
  renderControlPanel,
  renderHeader,
}) => {
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
    <ZoomContext.Provider value={zoom}>
      <div style={{ ...STYLES, position: 'relative' }}>
        <div style={STYLES}>
          <div
            style={{ ...STYLES, display: 'flex', flexDirection: 'column', overflow: 'auto' }}
            onScroll={handleScroll}
            ref={combinedRef}
            {...panZoomHandlers}
            className="diagramContainer"
          >
            {renderHeader ? renderHeader() : null}
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
    </ZoomContext.Provider>
  );
};

export default PanAndZoomContainer;
