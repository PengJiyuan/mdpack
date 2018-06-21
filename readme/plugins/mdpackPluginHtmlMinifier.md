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