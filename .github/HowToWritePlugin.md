# How to write a mdpack plugin?

Write a mdpack plugin is very simple, see below:

```javascript
function mdpackPluginXXX(opts) {
  this.name = opts.name;
}

// context is bundled markdown string or bundled html string
// you can distinguish between them by type.
mdpackPluginXXX.prototype.parse = function(context, type) {
  if(type === 'md') {
    context += this.name;
  }

  if(type === 'html') {
    context += `<h1>this.name<h1>`;
  }

  return context;
}

module.exports = mdpackPluginXXX;

```

Just publish this plugin to npm. plugin should named like `mdpack-plugin-xxx`.

Then you can use it:

```bash
npm i mdpack -D
npm i mdpack-plugin-xxx -D
```

```javascript
const mdpackPluginXXX = require('mdpack-plugin-xxx');
module.exports = {
  ...,
  plugins: [
    new mdpackPluginXXX({
      ...
    })
  ]
}
```