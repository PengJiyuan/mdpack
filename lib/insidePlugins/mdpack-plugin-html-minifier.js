const { minify } = require('html-minifier');

class mdpackPluginHtmlMinifier {
  constructor(opts = {}) {
    const defaultOptions = {
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true,
    };
    this.opts = Object.assign(defaultOptions, opts);
  }

  parse(context, type) {
    if (type === 'html') {
      context = minify(context, this.opts);
    }

    return context;
  }
}

module.exports = mdpackPluginHtmlMinifier;
