---
id: "orchestrate-commands"
title: "Orchestrate Bluehawk Commands"
slug: "/orchestrate-commands/"
sidebar_label: "Orchestrate Commands"
sidebar_position: 4
custom_edit_url: null
---

Instead of writing scripts or copy/pasting file paths for Bluehawk CLI commands,
you can use config files to define multiple commands. Then you can execute those
commands with one Bluehawk CLI command: [run](/reference/cli#run).

## Define Commands

To define CLI commands in a YAML configuration file:

1. At the root of your project, create a `bluehawk.config.yaml` file.
2. In your `bluehawk.config.yaml` file, add a `commands` property that will
   contain an array of objects.
3. Define all the commands you want this config file to run as a YAML object.

```yaml
# Example config file
commands:
  - command: snip
    source: App.tsx
    destination: generated
    format: rst
  - command: copy
    source: src/cool-feature
    destination: src/copy-to
  - command: snip
    source: src
    destination: generated/v2
```

## Use Multiple Config Files

You can define a Bluehawk config file for every directory. `bluehawk run`
searches all child directories for more config files and processes those
commands as well.

Define config files in child directories the same way you define the root
config file. They should all be named `bluehawk.config.yaml`.
