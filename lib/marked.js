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
  // 自定义heading
  renderer.heading = (text, level, raw) => {
    const id = `${raw.toLowerCase().replace(/[^\w]+/g, '-')}`;
    return `<h${level} id="${id}">
      <a href="#${id}" aria-hidden="true"><i class="icon icon-link"></i></a>
      ${text}
    </h${level}>\n`;
  };
  // 自定义code
  renderer.code = function (code, lang, escaped) {
    const isExec = regExec.test(code);

    // plugin process code.
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

    if (isExec && lang === 'javascript') {
      return `<script>\n${code}\n</script>`;
    } else if (isExec && lang === 'html') {
      return code.replace('// mdpack-exec', '');
    } else if (isExec && lang === 'css') {
      return `<style>${code.replace('// mdpack-exec', '')}</style>\n`;
    } else if (!lang) {
      return `<pre><code>${escaped ? code : escape(code, true)}</code></pre>`;
    }
    return `<pre><code class="${this.options.langPrefix}${escape(lang, true)}">${escaped ? code : escape(code, true)}</code></pre>\n`;
  };

  marked.setOptions({
    gfm: true,
    renderer,
    highlight(code, lang) {
      // const linedCode = hljs.highlightAuto(code, [lang]).value.split('\n').map(line => `<li>${line}</li>`).join('\n');
      return hljs.highlightAuto(code, [lang]).value;
    },
  });

  return marked(source);
}

module.exports = markedExpose;
