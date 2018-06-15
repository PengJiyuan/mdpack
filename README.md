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

## LICENSE

[MIT](./LICENSE) © PengJiyuan
