import React from 'react';

import DiagramTest from './DiagramTest';
// import {vertices, nodes} from './data/data1';
import {vertices, edges} from './data/dataReal';
export default function DiagramExample() {
 return (
   <DiagramTest
     vertices={vertices}
     edges={edges}
   />
 );
}