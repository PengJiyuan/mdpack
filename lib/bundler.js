const fs = require('fs-extra');
const path = require('path');
const marked = require('./marked');

function getDefaults() {
  return {
    markdownCss: 'https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css',
    highlightCss: 'https://unpkg.com/highlight.js@9.12.0/styles/github.css',
    template: path.resolve(__dirname, 'template/wrapper.html'),
  };
}

/**
 *
 * @param {Object} mdpackConfig The config of mdpack.
 */
function bundler(mdpackConfig = {
  entry: 'index.md',
  output: {
    path: './dist',
    name: 'bundle',
  },
}, tree) {
  const startTime = Date.now();
  const { entry } = mdpackConfig;

  const entryContent = fs.readFileSync(entry, 'utf8');
  const defaluts = getDefaults();
  const resources = Object.assign({
    markdownCss: defaluts.markdownCss,
    highlightCss: defaluts.highlightCss,
  }, mdpackConfig.resources || {});
  const template = mdpackConfig.template || defaluts.template;
  const plugins = mdpackConfig.plugins || [];

  let pureHtml,
    html;

  // object cache contains all chunks' content.
  const cache = {
    [entry]: entryContent,
  };

  // Get the final cache object.
  (function traval(_entry) {
    if (Array.isArray(_entry.children)) {
      _entry.children.forEach((child) => {
        cache[child.file] = fs.readFileSync(child.file, 'utf8');
        // remove unused line
        cache[child.file] = cache[child.file].replace('<!--mdpack-ignore-->\n', '');
        if (child.parent) {
          cache[entry] = cache[entry].replace(child.input, cache[child.file]);
        }
        traval(child);
      });
    }
  }(tree.entry));

  // plugin parse markdown
  plugins.forEach((plugin) => {
    if (plugin.parse) {
      cache[entry] = plugin.parse(cache[entry], 'md');
    }
  });

  mdpackConfig.format.forEach((f) => {
    if (f === 'html') {
      pureHtml = marked(cache[entry], plugins);

      html = fs.readFileSync(template, 'utf8');
      Object.keys(resources).forEach((rc) => {
        html = html.replace(`<% ${rc} %>`, resources[rc]);
      });
      html = html.replace('<% content %>', pureHtml);

      // plugin parse html
      plugins.forEach((plugin) => {
        if (plugin.parse) {
          html = plugin.parse(html, 'html');
        }
      });
    }
  });

  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) || 1;

  return {
    md: cache[entry],
    pureHtml,
    html,
    startTime,
    endTime,
    elapsedTime,
  };
}

module.exports = bundler;
