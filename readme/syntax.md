<!--mdpack-ignore-->
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