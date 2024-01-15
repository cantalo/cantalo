const autoprefixer = require("autoprefixer");
const postcssNested = require('postcss-nested');
const postcssHexrgba = require('postcss-hexrgba');

const config = {
  plugins: [
    postcssNested,
    postcssHexrgba,
    autoprefixer,
  ],
};

module.exports = config;
