import { useCallback } from 'react';
import { DEFAULT_ZOOM } from '../constants';
import { useZoomContext } from '../zoomContext';

export const useScrollToNode = () => {
  const { zoom = DEFAULT_ZOOM } = useZoomContext();

  const scrollToNode = useCallback(
    ({ position, offset }) => {
      const diagramContainer = document.getElementsByClassName('diagramContainer')?.[0];
      if (diagramContainer) {
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
