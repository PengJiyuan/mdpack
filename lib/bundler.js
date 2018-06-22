const marked = require('marked');
const hljs = require('highlight.js');
const fs = require('fs-extra');
const path = require('path');
const languages = require('./language');

marked.setOptions({
  gfm: true,
  highlight(code) {
    return hljs.highlightAuto(code, languages).value;
  },
});

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
  const { entry } = mdpackConfig;

  const entryContent = fs.readFileSync(entry, 'utf8');
  const defaluts = getDefaults();
  const resources = Object.assign({
    markdownCss: defaluts.markdownCss,
    highlightCss: defaluts.highlightCss,
  }, mdpackConfig.resources || {});
  const template = mdpackConfig.template || defaluts.template;
  const plugins = mdpackConfig.plugins || [];

  let html;

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
    cache[entry] = plugin.parse(cache[entry], 'md');
  });

  const pureHtml = marked(cache[entry]);

  html = fs.readFileSync(template, 'utf8')
    .replace('<% markdownCss %>', resources.markdownCss)
    .replace('<% highlightCss %>', resources.highlightCss)
    .replace('<% content %>', pureHtml);

  // plugin parse html
  plugins.forEach((plugin) => {
    html = plugin.parse(html, 'html');
  });

  return {
    md: cache[entry],
    pureHtml,
    html,
  };
}

module.exports = bundler;