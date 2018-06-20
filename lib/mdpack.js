const marked = require('marked');
const hljs = require('highlight.js');
const fs = require('fs-extra');
const path = require('path');
const languages = require('./language');
const insidePlugins = require('./insidePlugins');

const getTree = require('./tree');

marked.setOptions({
  gfm: true,
  highlight: function (code) {
    return hljs.highlightAuto(code, languages).value;
  }
});

function getDefaults() {
  return {
    markdownCss: 'https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css',
    highlightCss: 'https://unpkg.com/highlight.js@9.12.0/styles/github.css',
    template: path.resolve(__dirname, 'template/wrapper.html'),
    plugins: [
      // new mdpack.plugins.mdpackPluginBanner({
      //   banner: '# Banner',
      //   footer: '# Footer'
      // }),
      // new mdpack.plugins.mdpackPluginHtmlMinifier()
    ]
  }
}

/**
 *
 * @param {Object} mdpackConfig The config of mdpack.
 */
function mdpack(mdpackConfig = {
  entry: 'index.md',
  output: {
    path: './dist',
    name: 'bundle'
  }
}) {
  const entry = mdpackConfig.entry;
  const entryContent = fs.readFileSync(entry, 'utf8');
  const tree = getTree(entry);
  const defaluts = getDefaults();
  const resources = Object.assign({
    markdownCss: defaluts.markdownCss,
    highlightCss: defaluts.highlightCss
  }, mdpackConfig.resources || {});
  const template = mdpackConfig.template || defaluts.template;
  const plugins = mdpackConfig.plugins || [];

  let pureHtml, html;

  // object cache contains all chunks' content.
  let cache = {
    [entry]: entryContent
  };
  
  // Get the final cache object.
  function traval(_entry) {
    if(Array.isArray(_entry.children)) {
      _entry.children.forEach(child => {
        cache[child.file] = fs.readFileSync(child.file, 'utf8');
        if(child.parent) {
          cache[entry] = cache[entry].replace(child.input, cache[child.file]);
        }
        traval(child);
      });
    }
  }

  traval(tree.entry);

  // plugin parse markdown
  plugins.forEach(plugin => {
    cache[entry] = plugin.parse(cache[entry], 'md');
  });

  pureHtml = marked(cache[entry]);

  html = fs.readFileSync(template, 'utf8')
    .replace('<% markdownCss %>', resources.markdownCss)
    .replace('<% highlightCss %>', resources.highlightCss)
    .replace('<% content %>', pureHtml);

  // plugin parse html
  plugins.forEach(plugin => {
    html = plugin.parse(html, 'html');
  });

  return {
    md: cache[entry],
    pureHtml,
    html
  };
}

mdpack.plugins = insidePlugins;

module.exports = mdpack;
