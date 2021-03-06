## Usage

* **CLI**

```bash
mdpack -e index.md -p dist
```

* **Config**

```javascript
// mdpack.config.js
const path = require('path');
const mdpack = require('mdpack');

module.exports = {
  entry: 'index.md',
  output: {
    path: path.resolve(__dirname, 'dist'),
    name: 'mybundle'
  },
  format: ['md', 'html'],
  resources: {
    markdownCss: 'https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css',
    highlightCss: 'https://unpkg.com/highlight.js@9.12.0/styles/github-gist.css'
  },
  template: path.resolve(__dirname, 'mytemplate.html'),
  plugins: [
    // minify html output
    new mdpack.plugins.mdpackPluginHtmlMinifier(),
    // add banner and footer to bundled markdown and html.
    new mdpack.plugins.mdpackPluginBannerFooter({
      banner: '# Banner',
      footer: '# Footer'
    })
  ],
  watch: true
};
```

```bash
mdpack -c mdpack.config.js
```

* **NodeJS**

```javascript
const mdpack = require('mdpack');
const config = {
  entry: 'index.md',
  ...
};
mdpack(config);
```