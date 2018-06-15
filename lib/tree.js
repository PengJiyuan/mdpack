const fs = require('fs');
const path = require('path');

let result;
const tree = {
  entry: {}
};

function traval(file, reg, entry = tree.entry) {
  const children = [];
  const data = fs.readFileSync(file, 'utf8');

  while ((result = reg.exec(data)) != null)  {
    if(result[1]) {
      const current = {
        file: path.resolve(path.dirname(file), result[1]),
        parent: file,
        index: result.index,
        length: result[0].length,
        input: result[0]
      };
      entry.file = file;

      if(Array.isArray(entry.children)) {
        entry.children = entry.children.concat(current);
      } else {
        entry.children = [current];
      }

      children.push({
        current,
        path: path.resolve(path.dirname(file), result[1]),
        dirname: path.dirname(file)
      });
    }
  }
  if(children.length > 0) {
    children.forEach(child => {
      traval(path.resolve(child.dirname, child.path), reg, child.current);
    });
  }

  return tree;
}

module.exports = traval;
