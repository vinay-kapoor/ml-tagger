const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, '../public/index.html'),
    path.join(__dirname, '../public/js/**/*.js'),
    path.join(__dirname, '../api/*.js')
  ],
  theme: {
    extend: {
      colors: {
        expana : {
        green: '#cee7d5',
        darkgreen: '#06321e',
        hovergreen: '#0f7d4b',
        textmain: '#1a212f'
        }
      }
    },
  },
  plugins: [],
};