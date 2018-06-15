const fs = require('fs');

module.exports = {
  readFile: (file, option) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, option, (err, data) => {
        if(err) reject(err);
        resolve(data);
      });
    });
  }
};
