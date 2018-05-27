const path = require('path');

const config = {
  content: path.resolve(__dirname, 'src'),
  hot: {
    hot: true,
  },
  open: true,
};

module.exports = config;
