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
  scroll,
  contentSpan
}) => {
  const previousZoom = useRef(1);
  const diagramContainerRef = useRef();
  const { panZoomHandlers, setContainer, zoom, pan, setZoom } = usePanZoom({
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
    const container = containerRef.current;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let x = pan.x,
      y = pan.y;

    const extremeX = Math.max(contentSpan.x, containerWidth),
      extremeY = Math.max(contentSpan.y, containerHeight);

    if (containerWidth >= extremeX * zoom) {
      x = ((containerWidth - extremeX) * zoom) / 2;
    }
    if (containerHeight >= extremeY * zoom) {
      y = ((containerHeight - extremeY) * zoom) / 2;
    }

    diagramContainerRef.current.style.transform = `translate3D(${x}px, ${y}px, 0) scale(${zoom})`;

    container.scrollLeft =
      (scroll.left * zoom) / previousZoom.current +
      ((zoom - previousZoom.current) * containerWidth) /
        (2 * previousZoom.current);
    container.scrollTop =
      (scroll.top * zoom) / previousZoom.current +
      (scroll.top
        ? ((zoom - previousZoom.current) * containerHeight) /
          (2 * previousZoom.current)
        : 0);

    previousZoom.current = zoom;
  }, [containerRef, contentSpan.x, contentSpan.y, pan.x, pan.y, zoom]);

  useEffect(() => {
    const container = containerRef.current;
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  }, []);

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
