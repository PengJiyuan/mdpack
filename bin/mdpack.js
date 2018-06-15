#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const bundle = require('../lib/mdpack');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-e, --entry [entry]', 'Entry of markdown')
  .option('-o, --output [output]', 'Output of bundled markdown file.')
  .parse(process.argv);

if(program.entry && program.output) {
  const data = bundle(path.resolve(process.cwd(), program.entry));
  const outputFile = path.resolve(process.cwd(), program.output);

  fs.outputFile(outputFile, data, 'utf8', (err) => {
    if(err) throw err;
    console.log(`Bundled Success! output: ${outputFile}`);
  });
}
