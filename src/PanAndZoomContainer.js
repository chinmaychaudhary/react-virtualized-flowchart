import * as React from "react";
import { useCallback } from "react";
import usePanZoom from "use-pan-and-zoom";

import PanAndZoomControls from "./PanAndZoomControls";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 1.75;
const STEP_SIZE = 0.25;
const CENTER = {
  x: 0,
  y: 0
};

const DIMENSIONS_STYLES = {
  height: "100%",
  width: "100%"
};

const PanAndZoomContainer = ({
  children,
  handleScroll,
  containerRef,
  renderPanAndZoomControls
}) => {
  const {
    transform,
    panZoomHandlers,
    setContainer,
    zoom,
    setZoom
  } = usePanZoom({
    enablePan: false,
    disableWheel: true,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM
  });

  const incrementZoom = useCallback(() => {
    const incrementedZoom = Math.floor(zoom / STEP_SIZE + 1) * STEP_SIZE;
    setZoom(incrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const decrementZoom = useCallback(() => {
    const decrementedZoom = Math.floor((zoom - 0.01) / STEP_SIZE) * STEP_SIZE;
    setZoom(decrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const resetZoom = useCallback(() => {
    setZoom(1, CENTER);
  }, [setZoom]);

  const combinedRef = useCallback(
    el => {
      setContainer(el);
      containerRef.current = el;
    },
    [setContainer]
  );

  return (
    <div style={{ ...DIMENSIONS_STYLES, position: "relative" }}>
      <div style={DIMENSIONS_STYLES} className="flowchartContainer">
        <div
          style={{ ...DIMENSIONS_STYLES, overflow: "auto" }}
          onScroll={handleScroll}
          ref={combinedRef}
          {...panZoomHandlers}
        >
          <div
            style={{
              ...DIMENSIONS_STYLES,
              overflow: "visible",
              position: "relative",
              transform
            }}
            className="diagramContainer"
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
