// Libraries
import React from 'react';
import { DEFAULT_ZOOM } from './constants';

const ZoomContext = React.createContext({ zoom: DEFAULT_ZOOM });
ZoomContext.displayName = 'ZoomContext';

const useZoomContext = () => React.useContext(ZoomContext);

const ZoomContextProvider = ({ children }) => {
  const [zoom, setZoomContext] = React.useState(DEFAULT_ZOOM);

  const contextValue = React.useMemo(() => ({ zoom, setZoomContext }), [zoom]);

  return <ZoomContext.Provider value={contextValue}>{children}</ZoomContext.Provider>;
};

export { useZoomContext, ZoomContextProvider };
