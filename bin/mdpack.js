#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const bundle = require('../lib/mdpack');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-e, --entry [entry]', 'Entry of markdown')
  .option('-p, --path [path]', 'Output path of bundled markdown file.')
  .option('-n, --name [name]', 'Output name of bundled markdown file.', 'bundle')
  .option('-f, --format [format]', 'Format type of bundle output, (md, html, all)', /^(md|html|all)$/i, 'md')
  .option('--mc, --markdownCss [markdownCss]', 'Html template markdown css file')
  .option('--hc, --highlightCss [highlightCss]', 'Html template highlight css file')
  .option('-t, --template [template]', 'template file (optional)')
  .parse(process.argv);

function getOptions() {
  let options = {};
  if(program.markdownCss) {
    options.markdownCss = program.markdownCss;
  }
  if(program.highlightCss) {
    console.log('hc');
    options.highlightCss = program.highlightCss;
  }
  if(program.template) {
    options.template = path.resolve(process.cwd(), program.template);
  }

  return options;
}

if(program.entry && program.path) {
  const options = getOptions();
  const data = bundle(path.resolve(process.cwd(), program.entry), options);
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
