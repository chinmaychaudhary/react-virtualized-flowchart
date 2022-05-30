import './styles.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  babel: config => {
    console.log('asdfasdfasdfasdf', config);
    config.plugins.push('@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-private-property-in-object');
    return config;
  },
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
