import React from 'react';

import DiagramTest from './DiagramTest';
import {vertices, nodes} from './data/data1';

export default function DiagramExample() {
 return (
   <DiagramTest
     vertices={nodes}
   />
 );
}