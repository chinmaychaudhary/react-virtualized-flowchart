import { useCallback } from 'react';
import { DEFAULT_ZOOM } from '../constants';
import { useDiagramContext } from '../diagramContext';

export const useScrollToNode = () => {
  const { zoom = DEFAULT_ZOOM, containerRef } = useDiagramContext();

  const scrollToNode = useCallback(
    ({ position, offset }) => {
      if (containerRef?.current) {
        const diagramContainer = containerRef.current;
        diagramContainer.scrollTo({
          left: position.left * zoom - diagramContainer.clientWidth / 2 + offset.left,
          top: position.top * zoom - diagramContainer.clientHeight / 2 + offset.top,
          behavior: 'smooth',
        });
      }
    },
    [zoom]
  );

  return scrollToNode;
};
