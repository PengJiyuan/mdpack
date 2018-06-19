const marked = require('marked');
const hljs = require('highlight.js');
const fs = require('fs-extra');
const path = require('path');
const languages = require('./language');

const getTree = require('./tree');
const reg = /@@import\s+"(.+)*?"/g;

marked.setOptions({
  gfm: true,
  highlight: function (code) {
    return hljs.highlightAuto(code, languages).value;
  }
});

function getDefaults() {
  return {
    markdownCss: 'https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css',
    highlightCss: 'https://unpkg.com/highlight.js@9.12.0/styles/github-gist.css',
    template: path.resolve(__dirname, 'template/wrapper.html')
  }
}

/**
 *
 * @param {String} entry The entry markdown file path.
 * @param {Object} opts  Bundle options.
 * @param {String} opts.markdownCss css file of bundled html file. (default: https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css)
 * @param {String} opts.highlightCss css file of highlight. (default: https://unpkg.com/highlight.js@9.12.0/styles/github-gist.css)
 * @param {String} opts.template     html template file, should contents <% markdownCss %>, <% highlightCss %>, <% content %> (default: ./template/wrapper.html)
 */
function bundle(entry, opts = {}) {
  const entryContent = fs.readFileSync(entry, 'utf8');
  const tree = getTree(entry, reg);
  const options = Object.assign(getDefaults(), opts);
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

  pureHtml = marked(cache[entry]);

  html = fs.readFileSync(options.template, 'utf8')
    .replace('<% markdownCss %>', options.markdownCss)
    .replace('<% highlightCss %>', options.highlightCss)
    .replace('<% content %>', pureHtml);

  return {
    md: cache[entry],
    pureHtml,
    html
  };
}

module.exports = bundle;
