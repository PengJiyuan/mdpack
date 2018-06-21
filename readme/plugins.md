## Plugins

Mdpack support plugins, See [how to write a mdpack plugin?](./.github/HowToWritePlugin.md)

Mdpack also have some plugins inside:

* **mdpackPluginBannerFooter**

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

* **mdpackPluginHtmlMinifier**

Minify bundled html file.

`new mdpack.plugins.mdpackPluginBannerFooter(opts)`

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