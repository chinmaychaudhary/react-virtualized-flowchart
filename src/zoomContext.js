// Libraries
import React from 'react';
import { DEFAULT_ZOOM } from './constants';

const ZoomContext = React.createContext({ zoom: DEFAULT_ZOOM });
ZoomContext.displayName = 'ZoomContext';

const useZoomContext = () => React.useContext(ZoomContext);

export { useZoomContext, ZoomContext };
