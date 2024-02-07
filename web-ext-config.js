'use strict';

const path = require('path');

module.exports = {
  verbose: true,
  sourceDir: path.join(__dirname, 'src'),
  artifactsDir: path.join(__dirname, 'build'),
  build: {
    overwriteDest: true,
  },
  run: {
    startUrl: [
      'about:devtools-toolbox?type=extension&id=over18-cookie%40webdeveric.com',
      'about:config',
    ],
  },
  ignoreFiles: [ 'pnpm-lock.yaml' ],
};
