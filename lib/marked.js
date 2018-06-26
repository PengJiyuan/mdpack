const marked = require('marked');
const hljs = require('highlight.js');

const regExec = /\/\/\smdpack-exec/;
const renderer = new marked.Renderer();

function markedExpose(source, plugins) {
  renderer.code = function (code, lang, escaped) {
    const isExec = regExec.test(code);

    plugins.forEach((plugin) => {
      if (plugin.code && isExec) {
        code = plugin.code(code, lang);
      }
    });

    if (this.options.highlight && !isExec) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return !isExec
        ? `<pre><code>${(escaped ? code : escape(code, true))}</code></pre>`
        : `<script>\n${code}\n</script>`;
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

  return marked(source);
}

module.exports = markedExpose;
