const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, '../public/index.html'),
    path.join(__dirname, '../public/js/**/*.js'),
    path.join(__dirname, '../api/*.js')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};