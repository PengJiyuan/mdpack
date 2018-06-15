const remark = require('remark');
const html = require('remark-html');
const fs = require('fs');
const path = require('path');
const stringify = require("json-stringify-pretty-compact");
const getTree = require('./tree');
const reg = /@@import\s+"(.+)*?"/g;
// const entry = path.resolve(__dirname, '../_test/index.md');

function bundle = function(entry) {
  const entryContent = fs.readFileSync(entry, 'utf8');
  const tree = getTree(entry, reg);

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

  return cache[entry];
}

// fs.writeFileSync('output.md', cache[entry], 'utf8');

module.exports = bundle;

// console.log(md, reg.exec(md));

// remark()
//   .use(html)
//   .process(md, function (err, file) {
//     console.log(String(file));
//   });
