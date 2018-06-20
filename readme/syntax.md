<!--mdpack-ignore-->
## Syntax

#### Import

You can import **markdown** file or even **html** file.

> Attention: double quotes.

```markdown
@@import "path/xx.md"

@@import "path/xx.html"
```

#### Ignore

You can insert `<!--mdpack-ignore-->` in markdown file, usually at the top of the file.
Then mdpack will just output `@@import "xx.md"` as a string.