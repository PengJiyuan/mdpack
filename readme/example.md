## Example

index.md

```markdown
# Title

@@import './a.md'
```

a.md

```markdown
## SubTitle

BBBBBBBBBB
```

```bash
mdpack -e index.md -o output.md
```

Will Generate `output.md` like that:

```markdown
# Title

## SubTitle

BBBBBBBBBB
```