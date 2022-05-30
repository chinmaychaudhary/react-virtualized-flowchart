module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  babel: config => {
    return {
      ...config,
      plugins: [...(config.plugins ?? []), ['@babel/plugin-proposal-class-properties', { loose: true }]],
    };
  },
};
