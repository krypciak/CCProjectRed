module.exports = {
  // Despite the eslint config specifying that this rule is disabled, it still triggers.
  // eslint-disable-next-line node/no-unpublished-require
  ...require('eslint-config-dmitmel/prettier.config.js'),
};
