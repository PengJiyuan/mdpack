const bundler = require('./bundler');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const chokidar = require('chokidar');

const insidePlugins = require('./insidePlugins');
const getTree = require('./tree');
const { arrayDiff } = require('./utils/array');
const log = require('./utils/log');
const { prettyMs, prettyBytes } = require('./utils/pretty');

function writeFile(file, data) {
  return fs.outputFile(file, data, 'utf8')
    .then(() => `${chalk.green('[output]')} ${path.relative(process.cwd(), file)}`)
    .then((res) => {
      const { size } = fs.statSync(file, 'utf8');
      return `${res}  ${chalk.cyan(prettyBytes(size))}`;
    })
    .catch(err => err);
}

function write(outputFile, data) {
  const bundleList = [];
  Object.keys(outputFile).forEach((type) => {
    bundleList.push(writeFile(outputFile[type], data[type]));
  });
  return Promise.all(bundleList);
}

function mdpack(config) {
  if (config.entry && config.output.path) {
    const { tree, fileList } = getTree(config.entry);
    const format = config.format || ['md'];
    const outputFile = {};

    format.forEach((f) => {
      outputFile[f] = path.resolve(config.output.path, `${config.output.name}.${f}`);
    });

    if (config.watch) {
      const watcher = chokidar.watch(fileList, {
        interval: 500,
      });
      const restart = () => {
        const data = bundler(config, tree);
        write(outputFile, data, format)
          .then((info) => {
            log('\nTime:', prettyMs(data.elapsedTime));
            info.forEach((i) => {
              log(i);
            });
          });
      };

      let prevFileList = fileList;

      watcher
        .on('ready', () => {
          console.log(`${chalk.green('Mdpack')} is watching your files.`);
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

      write(outputFile, data, format)
        .then((info) => {
          log(chalk.green('[Mdpack] bundled success!\n'));
          log('Time:', prettyMs(data.elapsedTime));
          info.forEach((i) => {
            log(i);
          });
        });
    }
  }
}

mdpack.plugins = insidePlugins;

module.exports = mdpack;
