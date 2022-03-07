// Libraries
import * as React from "react";
import { useCallback, useEffect, useRef, useLayoutEffect } from "react";
import usePanZoom from "use-pan-and-zoom";

// Components
import PanAndZoomControls from "./PanAndZoomControls";

// Constants
import { MIN_ZOOM, MAX_ZOOM, STEP_SIZE, CENTER } from "./constants";

const STYLES = {
  height: "100%",
  width: "100%"
};

const PanAndZoomContainer = ({
  children,
  handleScroll,
  containerRef,
  renderPanAndZoomControls,
  scroll
}) => {
  const previousZoom = useRef(1);
  const diagramContainerRef = useRef();
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

  useEffect(() => {
    diagramContainerRef.current.style.transform = transform;
  }, [transform]);

  useLayoutEffect(() => {
    containerRef.current.scrollBy({
      left:
        (scroll.left * (zoom - previousZoom.current)) / previousZoom.current,
      top: (scroll.top * (zoom - previousZoom.current)) / previousZoom.current
    });
    previousZoom.current = zoom;
  }, [zoom]);

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
