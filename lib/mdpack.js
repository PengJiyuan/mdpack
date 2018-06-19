const marked = require('marked');
const hljs = require('highlight.js');
const fs = require('fs-extra');
const path = require('path');
const getTree = require('./tree');
const reg = /@@import\s+"(.+)*?"/g;

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

function bundle(entry) {
  const entryContent = fs.readFileSync(entry, 'utf8');
  const tree = getTree(entry, reg);
  let htmlString;

  let cache = {
    [entry]: entryContent
  };
  
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

  htmlString = marked(cache[entry]);

  return {
    md: cache[entry],
    pureHtml: htmlString,
    html: htmlString
  };
}

module.exports = bundle;
