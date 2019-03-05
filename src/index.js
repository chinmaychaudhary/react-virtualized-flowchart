import React, { useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";

import Diagram from "./Diagram";
import * as data1 from "./data/data1";
import * as data2 from "./data/data2";

import DiagramExample from './DiagramExample';

import "./styles.css";

function App() {
  const [nodes, setNodes] = useState(data1.nodes);
  const [connections, setConnections] = useState([...data1.connections]);
  const handleAdd = useCallback(
    () => {
      setNodes([...nodes, ...data2.nodes]);
      setConnections([
        ...connections,
        {
          id: "3-4",
          sourceId: "3",
          targetId: "4"
        },
        ...data2.connections
      ]);
    },
    [nodes, connections]
  );
  const handleDetach = useCallback(
    () => {
      setConnections(connections.filter(i => i.id !== "3-4"));
    },
    [connections]
  );
  const handleAttach = useCallback(
    () => {
      setConnections([
        ...connections,
        {
          id: "3-4",
          sourceId: "3",
          targetId: "4"
        }
      ]);
    },
    [connections]
  );

  const handleRemove = useCallback(() => {
    setNodes(data1.nodes);
    setConnections(data1.connections);
  });

  const stateMachineForSubtree = useMemo(
    () => ({
      ss1: {
        label: "Add subtree to 3",
        next: "ss2",
        handler: handleAdd
      },
      ss2: {
        label: "remove subtree",
        next: "ss1",
        handler: handleRemove
      }
    }),
    [handleAdd, handleRemove]
  );
  const stateMachineConnections = useMemo(
    () => ({
      sc1: {
        label: "remove 3-4 connection",
        next: "sc2",
        handler: handleDetach
      },
      sc2: {
        label: "connect 3-4",
        next: "sc1",
        handler: handleAttach
      }
    }),
    [handleDetach, handleAttach]
  );

  const [currentState1, setCurrentState1] = useState("ss1");
  const [currentState2, setCurrentState2] = useState("sc1");
  const handleButton1Click = () => {
    stateMachineForSubtree[currentState1].handler();
    setCurrentState1(stateMachineForSubtree[currentState1].next);
  };
  const handleButton2Click = () => {
    stateMachineConnections[currentState2].handler();
    setCurrentState2(stateMachineConnections[currentState2].next);
  };

  return (
    <div className="App">
      <Diagram nodes={nodes} connections={connections} />
      <button onClick={handleButton1Click}>
        {stateMachineForSubtree[currentState1].label}
      </button>
      <button onClick={handleButton2Click}>
        {stateMachineConnections[currentState2].label}
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<DiagramExample />, rootElement);
