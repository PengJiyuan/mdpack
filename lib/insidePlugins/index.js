const mdpackPluginBanner = require('./mdpack-plugin-banner-footer');
const mdpackPluginHtmlMinifier = require('./mdpack-plugin-html-minifier');
const mdpackPluginRemoveHead = require('./mdpack-plugin-remove-head');

const insidePlugins = {
  mdpackPluginBanner,
  mdpackPluginHtmlMinifier,
  mdpackPluginRemoveHead,
};

module.exports = insidePlugins;
