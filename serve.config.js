const path = require('path');

const config = {
  content: path.join(__dirname, 'src'),
  hot: {
    hot: true,
  },
  open: true,
};

module.exports = config;
