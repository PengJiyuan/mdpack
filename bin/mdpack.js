#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
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
  .option('-f, --format [format]', 'Format type of bundle output, (md, html, all)', /^(md|html|all)$/i, 'md')
  .option('--mc, --markdownCss [markdownCss]', 'Html template markdown css file')
  .option('--hc, --highlightCss [highlightCss]', 'Html template highlight css file')
  .option('-t, --template [template]', 'template file (optional)')
  .parse(process.argv);

let config;

if(program.config) {
  config = require(path.resolve(process.cwd(), program.config));
} else {
  config = argsToConfig(program);
}

if(config.entry && config.output.path) {
  const data = mdpack(config);
  const format = config.format || 'md';
  let outputFile;

  switch(format) {
    case 'md':
      outputFile = path.resolve(process.cwd(), config.output.path, `${config.output.name}.md`);
      break;
    case 'html':
      outputFile = path.resolve(process.cwd(), config.output.path, `${config.output.name}.html`);
      break;
    case 'all':
      outputFile = {
        md: path.resolve(process.cwd(), config.output.path, `${config.output.name}.md`),
        html: path.resolve(process.cwd(), config.output.path, `${config.output.name}.html`)
      };
  }

  function writeFile(file, data) {
    fs.outputFile(file, data, 'utf8', (err) => {
      if(err) throw err;
      console.log(`Bundled Success! output: ${file}`);
    });
  }

  if(typeof outputFile === 'object') {
    Object.keys(outputFile).forEach(type => {
      writeFile(outputFile[type], data[type]);
    })
  } else {
    writeFile(outputFile, data[format]);
  }
}
