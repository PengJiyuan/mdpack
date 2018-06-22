const bundler = require('./bundler');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const chokidar = require('chokidar');

const insidePlugins = require('./insidePlugins');
const getTree = require('./tree');
const { arrayDiff } = require('./utils/array');

function writeFile(file, data) {
  fs.outputFile(file, data, 'utf8', (err) => {
    if (err) throw err;
    console.log(`${chalk.green('[MDPACK]')} Bundled Success! output: ${file}`);
  });
}

function write(outputFile, data, format) {
  if (typeof outputFile === 'object') {
    Object.keys(outputFile).forEach((type) => {
      writeFile(outputFile[type], data[type]);
    });
  } else {
    writeFile(outputFile, data[format]);
  }
}

function mdpack(config) {
  if (config.entry && config.output.path) {
    const { tree, fileList } = getTree(config.entry);
    const format = config.format || 'md';
    let outputFile;

    switch (format) {
      case 'md':
        outputFile = path.resolve(config.output.path, `${config.output.name}.md`);
        break;
      case 'html':
        outputFile = path.resolve(config.output.path, `${config.output.name}.html`);
        break;
      case 'all':
        outputFile = {
          md: path.resolve(config.output.path, `${config.output.name}.md`),
          html: path.resolve(config.output.path, `${config.output.name}.html`),
        };
        break;
      default:
        break;
    }

    if (config.watch) {
      const watcher = chokidar.watch(fileList, {
        interval: 500,
      });
      const restart = () => {
        const data = bundler(config, tree);
        write(outputFile, data, format);
      };

      let prevFileList = fileList;

      watcher
        .on('ready', () => {
          console.log(`${chalk.green('Mdpack')} is watching your files.\n`);
          restart();
        })
        .on('change', () => {
          const _prevFileList = getTree(config.entry).fileList;
          const fileListDiff = arrayDiff(prevFileList, _prevFileList);

          prevFileList = _prevFileList;

          restart();

          if (!fileListDiff.eq) {
            watcher.add(fileListDiff.add);
            watcher.unwatch(fileListDiff.remove);
          }
        });
    } else {
      const data = bundler(config, tree);

      write(outputFile, data, format);
    }
  }
}

mdpack.plugins = insidePlugins;

module.exports = mdpack;
