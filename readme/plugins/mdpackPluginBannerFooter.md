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