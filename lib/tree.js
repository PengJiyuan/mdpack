const fs = require('fs');
const path = require('path');

const regImport = /@@import\s+"(.+)*?"/g;
const regIgnore = /<!--mdpack-ignore-->/i;

let result;
const tree = {
  entry: {},
};

function traval(file, entry = tree.entry) {
  const children = [];
  const data = fs.readFileSync(file, 'utf8');

  entry.children = [];

  while ((result = regImport.exec(data)) !== null) {
    if (result[1]) {
      const current = {
        file: path.resolve(path.dirname(file), result[1]),
        parent: file,
        index: result.index,
        length: result[0].length,
        input: result[0],
      };
      entry.file = file;

      if (regIgnore.test(data)) {
        current.ignore = true;
      } else {
        children.push({
          current,
          path: path.resolve(path.dirname(file), result[1]),
          dirname: path.dirname(file),
        });
        entry.children.push(current);
      }
    }
  }
  if (children.length > 0) {
    children.forEach((child) => {
      traval(path.resolve(child.dirname, child.path), child.current);
    });
  }

  return tree;
}

module.exports = traval;
