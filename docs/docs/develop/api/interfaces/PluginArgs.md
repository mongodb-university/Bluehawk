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

• **bluehawk**: [`Bluehawk`](../classes/Bluehawk.md)

The [[Bluehawk]] instance that a plugin can use to add Bluehawk commands,
languages, and listeners.

#### Defined in

[bluehawk/Plugin.ts:49](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L49)

___

### bluehawkVersion

• **bluehawkVersion**: `string`

The current semantic version string of Bluehawk.

#### Defined in

[bluehawk/Plugin.ts:60](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L60)

___

### yargs

• **yargs**: `Argv`

The [yargs](https://yargs.js.org/) instance that a plugin can modify to add
CLI commands and options.

#### Defined in

[bluehawk/Plugin.ts:55](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L55)

___

### yargsVersion

• **yargsVersion**: `string`

The current semantic version string of Yargs.

#### Defined in

[bluehawk/Plugin.ts:65](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L65)
