const marked = require('marked');
const hljs = require('highlight.js');

const regExec = /\/\/\smdpack-exec/;
const renderer = new marked.Renderer();

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
        code = out;
      }
    }

    if (!lang) {
      return (isExec && lang === 'javascript')
        ? `<script>\n${code}\n</script>`
        : `<pre><code>${escaped ? code : escape(code, true)}</code></pre>`;
    }

    return (isExec && lang === 'javascript')
      ? `<script>\n${code}\n</script>`
      : `<pre><code class="${this.options.langPrefix}${escape(lang, true)}">${escaped ? code : escape(code, true)}</code></pre>\n`;
  };

  marked.setOptions({
    gfm: true,

    highlight(code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    },
  });

  return marked(source);
}

module.exports = markedExpose;
