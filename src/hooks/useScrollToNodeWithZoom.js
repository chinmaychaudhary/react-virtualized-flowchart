import { useCallback } from 'react';
import { DEFAULT_ZOOM } from '../constants';
import { useZoomContext } from '../zoomContext';

export const useScrollToNodeWithZoom = () => {
  const { zoom = DEFAULT_ZOOM } = useZoomContext();

  const scrollToNode = useCallback(
    ({ leftOffset, topOffset, leftExtra = 0, topExtra = 0 }) => {
      const diagramContainer = document.getElementsByClassName('diagramContainer')?.[0];
      if (diagramContainer) {
        diagramContainer.scrollTo({
          left: leftOffset * zoom - diagramContainer.clientWidth / 2 + leftExtra,
          top: topOffset * zoom - diagramContainer.clientHeight / 2 + topExtra,
          behavior: 'smooth',
        });
      }
    },
    [zoom]
  );

  return scrollToNode;
};
