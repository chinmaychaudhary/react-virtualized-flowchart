import React, { memo } from "react";
import PropTypes from "prop-types";

import { getOverlayId } from "./helper";

const Overlays = memo(props => props.renderOverlays(props.edges, getOverlayId));

Overlays.displayName = "Overlays";
Overlays.propTypes = {
  edges: PropTypes.array.isRequired,
  renderOverlays: PropTypes.func.isRequired
};

export default Overlays;
