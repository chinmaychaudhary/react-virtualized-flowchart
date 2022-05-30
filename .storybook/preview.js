import React from 'react';
import './styles.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  Story => {
    return (
      <div style={{ overflow: 'auto', height: 'calc(100vh - 2rem)' }}>
        <Story />
      </div>
    );
  },
];
