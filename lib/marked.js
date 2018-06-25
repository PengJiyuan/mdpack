const marked = require('marked');
const hljs = require('highlight.js');

const regExec = /\/\/\smdpack-exec/;
const renderer = new marked.Renderer();
renderer.code = function (code, lang, escaped) {
  const isExec = regExec.test(code);

  if (this.options.highlight) {
    const out = !isExec ? this.options.highlight(code, lang) : code;
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return !isExec
      ? `<pre><code>${(escaped ? code : escape(code, true))}</code></pre>`
      : '';
  }

  return !isExec
    ? `<pre><code class="${this.options.langPrefix}${escape(lang, true)}">${(escaped ? code : escape(code, true))}</code></pre>\n`
    : `<script>\n${code}\n</script>`;
};

marked.setOptions({
  gfm: true,
  renderer,
  highlight(code, lang) {
    return hljs.highlightAuto(code, [lang]).value;
  },
});

module.exports = marked;
