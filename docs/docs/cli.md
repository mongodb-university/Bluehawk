---
id: "cli"
title: "CLI"
sidebar_label: "CLI"
sidebar_position: 2
custom_edit_url: null
---

## Tags

Use tags to generate different kinds of output with Bluehawk, including
code blocks, full files of code, and even error checks.

> 💡 Tags for the Bluehawk CLI are not the same as
> [Bluehawk Tags](./tags), the syntax
> interpreted by Bluehawk to process input files.

### Snip

```
bluehawk snip --destination <output-directory> <input-directory-or-file>
```

Output "snippet files" that contain only the content of `code-block` or
`snippet` Bluehawk tags, named in the format
`<source-file-name>.codeblock.<codeblock-name>.<source-file-extension>`.
By default, this tag generates snippets
that omit all `state` tag contents. However,
you can use the `--state` flag to generate snippet files that include
content from a single state that you specify.

### Copy

```
bluehawk copy --destination <output-directory> <input-directory-or-file>
```

Output full bluehawk-processed input files, in their original directory
structure, to destination directory. Binary files are copied without
Bluehawk processing. You can use the `--ignore` flag to add gitignore-style
ignore patterns that omit matched files from output.
By default, this tag generates output files that omit all `state`.
However, you can use the `--state` flag to generate output files that
include content from a single state that you specify.

### Check

```
bluehawk check <input-directory-or-file>
```

Generates non-zero output if processing any input files generates a Bluehawk
error, zero output otherwise. Does not generate any files: instead, `check`
outputs directly to tag line.

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
This tag currently only supports
[reStructuredText](https://en.wikipedia.org/wiki/ReStructuredText) syntax using
the identifier `rst`.
