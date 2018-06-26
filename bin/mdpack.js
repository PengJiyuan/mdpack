#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const mdpack = require('../lib/mdpack');
const pkg = require('../package.json');
const argsToConfig = require('./argsToConfig');

program
  .version(pkg.version)
  .option('-c, --config [config]', 'Use config file.')
  .option('-e, --entry [entry]', 'Entry of mdpack, a markdown file.')
  .option('-p, --path [path]', 'Output path of bundled markdown file.')
  .option('-n, --name [name]', 'Output name of bundled markdown file.', 'bundle')
  .option('-f, --format [format]', 'Format type of bundle output', 'md')
  .option('-w, --watch', 'Watch files and recompile')
  .option('--mc, --markdownCss [markdownCss]', 'Html template markdown css file')
  .option('--hc, --highlightCss [highlightCss]', 'Html template highlight css file')
  .option('-t, --template [template]', 'template file (optional)')
  .parse(process.argv);

let config;

if (program.config) {
  config = require(path.resolve(process.cwd(), program.config));
} else {
  config = argsToConfig(program);
}

mdpack(config);
