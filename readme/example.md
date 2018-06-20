## Example

index.md

```markdown
# Title

@@import './a.md'

@@import './b.html'
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

```bash
mdpack -e index.md -o output.md
```

Will Generate `output.md` like that:

```markdown
# Title

## SubTitle

BBBBBBBBBB

<h1 class="mine">This is my import!</h1>
```