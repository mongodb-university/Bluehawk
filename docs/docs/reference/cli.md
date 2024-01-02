---
id: "cli"
title: "CLI"
sidebar_label: "CLI"
sidebar_position: 2
custom_edit_url: null
---

## Commands

Use commands to generate different kinds of output with Bluehawk, including
code blocks, full files of code, and even error checks.

### Snip

```
bluehawk snip --output <output-directory> <input-directory-or-file>
```

Output "snippet files" that contain only the content of `snippet` or
`snippet` Bluehawk tags, named in the format
`<source-file-name>.snippet.<snippet-name>.<source-file-extension>`.
By default, this command generates snippets
that omit all `state` tag contents. However,
you can use the `--state` flag to generate snippet files that include
content from a single state that you specify.

### Copy

```
bluehawk copy --output <output-directory> <input-directory-or-file>
```

Output full bluehawk-processed input files, in their original directory
structure, to output directory. Binary files are copied without
Bluehawk processing. You can use the `--ignore` flag to add gitignore-style
ignore patterns that omit matched files from output.
By default, this command generates output files that omit all `state`.
However, you can use the `--state` flag to generate output files that
include content from a single state that you specify.
If you would like to rename files as you copy them, use
the `--rename` flag. The `--rename` flag takes a JSON
string as an argument. The JSON must represent an object whose keys are filenames that are to be renamed and whose values are the new names of those files.
For example, ` --rename '{"test.txt":"test_new.txt"}'` changes the name of any file names `test.txt` to `test_new.txt`. The `--rename` flag cannot accept a JSON
object whose keys or values contain a path. If you
require this functionality, please submit a pull
request or issue on Github.

### Check

```
bluehawk check <input-directory-or-file>
```

Generates non-zero output if processing any input files generates a Bluehawk
error, zero output otherwise. Does not generate any files: instead, `check`
outputs directly to the command line.

## Flags

You can use flags to tweak the output of Bluehawk.

### Ignore

Pass a pattern to the `--ignore` flag to omit any file that matches that
pattern from Bluehawk's input files. Bluehawk will not process or generate
output for any ignored file. You can use the `ignore` flag multiple times
in a single Bluehawk execution to ignore multiple patterns. `.gitignore` files
in the input directory tree are automatically used as ignore patterns.

### State

Pass a state's id to the `--state` flag to include only the contents of that
state, and no other states, in the generated output.

### Format

Pass the name of a markup syntax to the `--format` flag when generating snippets
to generate a formatted version of that snippet in the specified markup syntax.
This command currently supports the following options:

- `rst`: [ReStructuredText](https://en.wikipedia.org/wiki/ReStructuredText) syntax
- `md`: [Markdown fenced codeblock](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks) syntax
  using backticks (`). Markdown format does not support the [emphasize tag](./tags#emphasize).
- `docusaurus`: Docusaurus syntax with [comment highlighting](https://docusaurus.io/docs/markdown-features/code-blocks#highlighting-with-comments)
