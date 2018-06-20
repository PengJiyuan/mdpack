const minify = require('html-minifier').minify;

function mdpackPluginHtmlMinifier(opts = {}) {
  const defaultOptions = {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    collapseWhitespace: true
  };
  this.opts = Object.assign(defaultOptions, opts);
}

mdpackPluginHtmlMinifier.prototype.parse = function(context, type) {
  if(type === 'html') {
    context = minify(context, this.opts);
  }

  return context;
}

module.exports = mdpackPluginHtmlMinifier;
