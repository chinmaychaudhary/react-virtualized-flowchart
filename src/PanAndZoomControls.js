import * as React from "react";

const BUTTON_STYLES = {
  height: "40px",
  width: "40px"
};

const PanAndZoomControls = ({
  zoom,
  decrementZoom,
  incrementZoom,
  resetZoom,
  renderPanAndZoomControls
}) => {
  if (renderPanAndZoomControls) {
    return (
      <React.Fragment>
        {renderPanAndZoomControls({
          zoom,
          decrementZoom,
          incrementZoom,
          resetZoom
        })}
      </React.Fragment>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        alignItems: "center",
        margin: "20px",
        zIndex: 20,
        bottom: "0px",
        right: "0px"
      }}
    >
      <button onClick={decrementZoom} style={BUTTON_STYLES}>
        -
      </button>
      <button onClick={resetZoom} style={{ height: "40px" }}>{`${Math.round(
        zoom * 100
      )} %`}</button>
      <button onClick={incrementZoom} style={BUTTON_STYLES}>
        +
      </button>
    </div>
  );
};

export default PanAndZoomControls;
