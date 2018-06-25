<!--mdpack-ignore-->
## Example

index.md

```markdown
# Title

@@import "./a.md"

@@import "./b.html"
```

a.md

```markdown
## SubTitle

BBBBBBBBBB
```

b.html

```html
<h1 class="mine">This is my import!</h1>
```

run `mdpack`:

```bash
mdpack -e index.md -p . -n output -f all
```

mdpack output:

```
[Mdpack] bundled success!

Time: 16ms
[output] output.md  74B
[output] output.html  704B
```

Will generate `output.md` like that:

```markdown
# Title

## SubTitle

BBBBBBBBBB

<h1 class="mine">This is my import!</h1>
```

Will generate `output.html` like that:

```html
<html>
  <head>
    <link href="https://unpkg.com/github-markdown-css@2.10.0/github-markdown.css" rel="stylesheet" />
    <link href="https://unpkg.com/highlight.js@9.12.0/styles/github.css" rel="stylesheet" />
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }

      @media (max-width: 767px) {
        .markdown-body {
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="markdown-body">
      <h1 id="title">Title</h1>
<h2 id="subtitle">SubTitle</h2>
<p>BBBBBBBBBB</p>
<h1 class="mine">This is my import!</h1>
    </div>
  </body>
</html>
```