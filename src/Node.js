import React from "react";

function Node(props) {
  const { position, label, id } = props.node;
  return (
    <div className="node" style={position} id={id}>
      {label}
    </div>
  );
}

export default Node;
