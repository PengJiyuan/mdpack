/**
 * @param {Object} program
 *
 * @param {String} program.entry Entry of mdpack, a markdown file.
 * @param {Object} program.output Output of bundled markdown file. include path and name.
 * @param {String} program.format Format type of bundle output, (md, html, all)
 * @param {Object} program.resources Html template css and js files, include markdownCss, highlightCss...
 * @param {String} program.template Html template file.
 */
function argsToConfig(program) {
  const config = {};

  if (program.entry) {
    config.entry = program.entry;
  }

  if (program.path && program.name) {
    config.output = {
      path: program.path,
      name: program.name,
    };
  }

  if (program.format) {
    config.format = program.format;
  }

  config.resources = {};

  if (program.markdownCss) {
    config.resources.markdownCss = program.markdownCss;
  }

  if (program.highlightCss) {
    config.resources.highlightCss = program.highlightCss;
  }

  if (!program.markdownCss && !program.highlightCss) {
    delete config.resources;
  }

  if (program.template) {
    config.template = program.template;
  }

  return config;
}

module.exports = argsToConfig;
