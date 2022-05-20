---
id: "PluginArgs"
title: "Interface: PluginArgs"
sidebar_label: "PluginArgs"
sidebar_position: 0
custom_edit_url: null
---

The arguments passed from the CLI to a plugin's register() function.

## Properties

### bluehawk

• **bluehawk**: [`Bluehawk`](../classes/Bluehawk)

The [Bluehawk](../classes/Bluehawk) instance that a plugin can use to add Bluehawk commands,
languages, and listeners.

#### Defined in

[src/bluehawk/Plugin.ts:49](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L49)

___

### bluehawkVersion

• **bluehawkVersion**: `string`

The current semantic version string of Bluehawk.

#### Defined in

[src/bluehawk/Plugin.ts:60](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L60)

___

### yargs

• **yargs**: `Argv`<{}\>

The [yargs](https://yargs.js.org/) instance that a plugin can modify to add
CLI commands and options.

#### Defined in

[src/bluehawk/Plugin.ts:55](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L55)

___

### yargsVersion

• **yargsVersion**: `string`

The current semantic version string of Yargs.

#### Defined in

[src/bluehawk/Plugin.ts:65](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L65)
