import * as React from "react";

import PanAndZoomControls from "./PanAndZoomControls";

import { usePanAndZoom } from "./hooks/usePanAndZoom";

const STYLES = {
  height: "100%",
  width: "100%"
};

const PanAndZoomContainer = ({
  children,
  handleScroll,
  containerRef,
  renderPanAndZoomControls,
  scroll,
  contentSpan
}) => {
  const {
    zoom,
    panZoomHandlers,
    combinedRef,
    diagramContainerRef,
    incrementZoom,
    decrementZoom,
    resetZoom
  } = usePanAndZoom({ containerRef, scroll, contentSpan });

  return (
    <div style={{ ...STYLES, position: "relative" }}>
      <div style={STYLES}>
        <div
          style={{ ...STYLES, overflow: "auto" }}
          onScroll={handleScroll}
          ref={combinedRef}
          {...panZoomHandlers}
          className="diagramContainer"
        >
          <div
            ref={diagramContainerRef}
            style={{
              ...STYLES,
              overflow: "visible",
              position: "relative"
            }}
          >
            {children({ zoom })}
          </div>
        </div>
      </div>
      <PanAndZoomControls
        zoom={zoom}
        decrementZoom={decrementZoom}
        incrementZoom={incrementZoom}
        resetZoom={resetZoom}
        renderPanAndZoomControls={renderPanAndZoomControls}
      />
    </div>
  );
};

export default PanAndZoomContainer;
