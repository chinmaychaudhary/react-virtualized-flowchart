import React from 'react';

import { vertices as initialVertices, edges as initialEdges } from './dataReal';

import DiagramExample from '../components/DiagramExample';

const initialState = { initialVertices, initialEdges };

export default {
  title: 'Diagram',
  component: DiagramExample,
};

const Template = args => <DiagramExample {...args} initialState={initialState} />;

export const Basic = Template.bind({});
