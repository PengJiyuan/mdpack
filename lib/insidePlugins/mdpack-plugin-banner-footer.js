function mdpackPluginBannerFooter(opts) {
  this.banner = opts.banner;
  this.footer = opts.footer;
}

mdpackPluginBannerFooter.prototype.parse = function (context, type) {
  if (type === 'md') {
    if (this.banner) {
      context = `${this.banner}\n\n${context}`;
    }
    if (this.footer) {
      context = `${context}\n\n${this.footer}`;
    }
  }

  return context;
};

module.exports = mdpackPluginBannerFooter;
