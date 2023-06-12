// Libraries
import React from 'react';
import { DEFAULT_ZOOM } from './constants';

const DiagramContext = React.createContext({ zoom: DEFAULT_ZOOM });
DiagramContext.displayName = 'DiagramContext';

const useDiagramContext = () => React.useContext(DiagramContext);

const DiagramContextProvider = ({ children, zoom, setZoom, containerRef }) => {
  const initialValue = React.useMemo(() => ({ zoom, setZoom, containerRef }), [zoom, setZoom, containerRef]);
  return <DiagramContext.Provider value={initialValue}>{children}</DiagramContext.Provider>;
};

export { useDiagramContext, DiagramContextProvider };
