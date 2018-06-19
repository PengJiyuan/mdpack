# mdpack
markdown bundler.

## Install

```bash
npm i mdpack -g
```

## Usage

```bash
mdpack -e index.md -o dist/output.md
```

## Syntax

```markdown
@@import 'path/xx.md'
```

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

## Options

#### -e, --entry

`optional`

Entry of mdpack, a markdown file. (default: `index.md`)

#### -p, --path

Output path of bundled markdown file.

#### -n, --name

`optional`

Output name of bundled markdown file. (default: `bundle`)

#### -f, --format [md | html | all]

`optional`

Format type of bundle output. (default: `md`)

#### --mc, --markdownCss [markdownCss]

`optional`

Html template markdown css file, if not specified, mdpack will use a default cdn css.

#### --hc, --highlightCss [highlightCss]

`optional`

Html template highlight css file, if not specified, mdpack will use a default cdn css.

#### -t, --template [template]

`optional`

Template html file. If you specify a template, this template should contains these keywords:

* `<% markdownCss %>`
* `<% highlightCss %>`
* `<% content %>`

## LICENSE

[MIT](./LICENSE) © PengJiyuan
