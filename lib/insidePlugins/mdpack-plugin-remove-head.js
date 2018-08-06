const frontMatter = require('@egoist/front-matter');

class mdpackPluginRemoveHead {
  parse(context, type) {
    if (type === 'md') {
      context = frontMatter(context).body;
    }

    return context;
  }
}

module.exports = mdpackPluginRemoveHead;
