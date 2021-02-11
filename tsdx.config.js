module.exports = {
  rollup(config, options) {
    config.output.name = 'formatQuantity';
    config.output.exports = 'default';
    return config;
  },
};
