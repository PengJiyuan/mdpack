[![Travis](https://img.shields.io/travis/PengJiyuan/mdpack.svg)](https://travis-ci.org/PengJiyuan/mdpack)
[![npm](https://img.shields.io/npm/v/mdpack.svg)](https://www.npmjs.com/package/mdpack)
[![npm](https://img.shields.io/npm/l/mdpack.svg)](https://www.npmjs.com/package/mdpack)

![Logo](./.github/logo.png)

# mdpack
markdown bundler, import markdown and html like javascript.

This README is generated by mdpack. see [readme](https://github.com/PengJiyuan/mdpack/tree/master/readme).

## Deprecated

[docz](https://github.com/pedronauck/docz): That's what I am trying to do.

## Install

```bash
npm i mdpack -g
# or
npm i mdpack -D
```

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

## Syntax

#### Import

You can import **markdown** file or **html** file or any file type.

> Attention: double quotes.

```markdown
@@import "path/xx.md"

@@import "path/xx.html"
```

#### Ignore

You can insert `<!--mdpack-ignore-->` in markdown file, usually at the top of the file.
Then mdpack will just output `@@import "xx.md"` as a string.

#### Code exec

If you want the code you inserted execute, just comment `// mdpack-exec` on the top of code block.

eg:

```markdown
// mdpack-exec
const list = ['peng', 'ji', 'yuan'];
console.log(...list);
```

will output:

```html
<script>
// mdpack-exec
const list = ['peng', 'ji', 'yuan'];
console.log(...list);
</script>
```

You can also use [mdpack-plugin-babel](https://github.com/PengJiyuan/mdpack-plugin-babel) to transform javascript code:

```html
<script>
"use strict";var _console,list=["peng","ji","yuan"];(_console=console).log.apply(_console,list)
</script>
```

## Example

index.md

```markdown
# Title

@@import "./a.md"

@@import "./b.html"
```

a.md

```markdown
## SubTitle

BBBBBBBBBB
```

b.html

```html
<h1 class="mine">This is my import!</h1>
```

run `mdpack`:

```bash
mdpack -e index.md -p . -n output -f md,html
```

mdpack output:

```
[Mdpack] bundled success!

Time: 16ms
[output] output.md  74B
[output] output.html  704B
```

Will generate `output.md` like that:

```markdown
# Title

## SubTitle

BBBBBBBBBB

<h1 class="mine">This is my import!</h1>
```

Will generate `output.html` like that:

```html
<html>
  <head>
    <link href="https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css" rel="stylesheet" />
    <link href="https://unpkg.com/highlight.js@9.12.0/styles/github.css" rel="stylesheet" />
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }

      @media (max-width: 767px) {
        .markdown-body {
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="markdown-body">
      <h1 id="title">Title</h1>
<h2 id="subtitle">SubTitle</h2>
<p>BBBBBBBBBB</p>
<h1 class="mine">This is my import!</h1>
    </div>
  </body>
</html>
```

## Options

#### -c, --config

Specify a config file, usually named `mdpack.config.js`.

#### -e, --entry

`optional`

Entry of mdpack, a markdown file. (default: `index.md`)

#### -p, --path

Output path of bundled markdown file.

#### -n, --name

`optional`

Output name of bundled markdown file. (default: `bundle`)

#### -f, --format [md | html | all]

`optional`

Format type of bundle output. (default: `md`)

#### --mc, --markdownCss [markdownCss]

`optional`

Html template markdown css file, if not specified, mdpack will use a default cdn css.

#### --hc, --highlightCss [highlightCss]

`optional`

Html template highlight css file, if not specified, mdpack will use a default cdn css.

#### -t, --template [template]

`optional`

Template html file. If you specify a template, this template should contains these keywords:

* `<% markdownCss %>`
* `<% highlightCss %>`
* `<% content %>`

#### -w, --watch

Watch files change and recompile.

## Plugins

Mdpack support plugins, See [how to write a mdpack plugin?](./.github/HowToWritePlugin.md)

#### Plugin List

| Plugin name   |      Description      |  Author |
|----------|:-------------:|------:|
| [mdpack-plugin-babel](https://github.com/PengJiyuan/mdpack-plugin-babel) |  A mdpack plugin use babel to transform mdpack-exec code to es5. | [PengJiyuan](https://github.com/PengJiyuan) |

Mdpack also have some plugins inside:

### **mdpackPluginBannerFooter**

Add a banner at the top of bundled file, or add a footer at the bottom of bundled file.

`new mdpack.plugins.mdpackPluginBannerFooter(opts)`

#### opts.banner {String}

#### opts.footer {String}

```javascript
module.exports = {
  ...,
  plugins: [
    new mdpack.plugins.mdpackPluginBannerFooter({
      banner: '# Banner',
      footer: '## Footer'
    })
  ]
}
```

### **mdpackPluginHtmlMinifier**

Minify bundled html file.

`new mdpack.plugins.mdpackPluginHtmlMinifier(opts)`

`opts` is same to [html-minifier](https://github.com/kangax/html-minifier)

```javascript
module.exports = {
  ...,
  plugins: [
    new mdpack.plugins.mdpackPluginHtmlMinifier({
      removeComments: false,
      removeEmptyElements: true,
      ...
    })
  ]
}
```

## LICENSE

[MIT](./LICENSE) © PengJiyuan
