## Options

#### -c, --config

Specify a config file, usually named `mdpack.config.js`.

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

@@import "options/template.md"