import React from 'react';

import Diagram from './Diagram';
// import {vertices, nodes} from './data/data1';
import {vertices, edges} from './data/dataReal';
export default function DiagramExample() {
 return (
   <Diagram
     vertices={vertices}
     edges={edges}
   />
 );
}