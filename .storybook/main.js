module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
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
