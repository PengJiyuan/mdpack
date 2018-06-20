#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const mdpack = require('../lib/mdpack');
const pkg = require('../package.json');
const argsToConfig = require('./argsToConfig');

program
  .version(pkg.version)
  .option('-c, --config [config]', 'Use config file.', 'mdpack.config.js')
  .option('-e, --entry [entry]', 'Entry of mdpack, a markdown file.')
  .option('-p, --path [path]', 'Output path of bundled markdown file.')
  .option('-n, --name [name]', 'Output name of bundled markdown file.', 'bundle')
  .option('-f, --format [format]', 'Format type of bundle output, (md, html, all)', /^(md|html|all)$/i, 'md')
  .option('--mc, --markdownCss [markdownCss]', 'Html template markdown css file')
  .option('--hc, --highlightCss [highlightCss]', 'Html template highlight css file')
  .option('-t, --template [template]', 'template file (optional)')
  .parse(process.argv);

const config = argsToConfig(program);

if(program.entry && program.path) {
  const data = mdpack(config);
  let outputFile;

  switch(program.format) {
    case 'md':
      outputFile = path.resolve(process.cwd(), program.path, `${program.name}.md`);
      break;
    case 'html':
      outputFile = path.resolve(process.cwd(), program.path, `${program.name}.html`);
      break;
    case 'all':
      outputFile = {
        md: path.resolve(process.cwd(), program.path, `${program.name}.md`),
        html: path.resolve(process.cwd(), program.path, `${program.name}.html`)
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
    writeFile(outputFile, data[program.format]);
  }
}
