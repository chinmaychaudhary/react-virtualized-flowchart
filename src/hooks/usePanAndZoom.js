import { useEffect, useRef, useCallback } from "react";
import usePanZoom from "use-pan-and-zoom";

import {
  MIN_ZOOM,
  MAX_ZOOM,
  STEP_SIZE,
  CENTER,
  DEFAULT_ZOOM
} from "../constants";

import { getTranslate3DCoordinates, getContainerScroll } from "../helper";

const usePanAndZoom = ({ containerRef, scroll, contentSpan }) => {
  const previousZoom = useRef(DEFAULT_ZOOM);
  const diagramContainerRef = useRef();
  const { panZoomHandlers, setContainer, zoom, pan, setZoom } = usePanZoom({
    enablePan: false,
    disableWheel: true,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM
  });

  const incrementZoom = useCallback(() => {
    const incrementedZoom = zoom + STEP_SIZE;
    setZoom(incrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const decrementZoom = useCallback(() => {
    const decrementedZoom = zoom - STEP_SIZE;
    setZoom(decrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const resetZoom = useCallback(() => {
    setZoom(DEFAULT_ZOOM, CENTER);
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
    const { clientWidth, clientHeight } = container;

    const { translateX, translateY } = getTranslate3DCoordinates(
      clientWidth,
      clientHeight,
      pan,
      zoom,
      contentSpan
    );

    diagramContainerRef.current.style.transform = `translate3D(${translateX}px, ${translateY}px, 0) scale(${zoom})`;

    const { scrollLeft, scrollTop } = getContainerScroll(
      scroll.left,
      scroll.top,
      zoom,
      previousZoom.current,
      clientWidth,
      clientHeight
    );

    container.scrollLeft = scrollLeft;
    container.scrollTop = scrollTop;

    previousZoom.current = zoom;
  }, [contentSpan.x, contentSpan.y, pan.x, pan.y, zoom]);

  useEffect(() => {
    const container = containerRef.current;
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  }, []);

  return {
    zoom,
    panZoomHandlers,
    combinedRef,
    diagramContainerRef,
    incrementZoom,
    decrementZoom,
    resetZoom
  };
};

export { usePanAndZoom };
