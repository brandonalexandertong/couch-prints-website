const path = require('path');

module.exports = {
 entry: './src/scripts/main.js',

 output: {
   path: path.resolve(__dirname, '_site/assets'),
   filename: 'main.js'
  },
 module: {
  rules: [
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
  ],
 },
 
}