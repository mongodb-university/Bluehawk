---
id: "AnyCommand"
title: "Interface: AnyCommand"
sidebar_label: "AnyCommand"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Command`

  ↳ **`AnyCommand`**

## Properties

### attributesSchema

• `Optional` **attributesSchema**: `AnySchema`

#### Inherited from

Command.attributesSchema

#### Defined in

[src/bluehawk/commands/Command.ts:15](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L15)

___

### description

• `Optional` **description**: `string`

#### Inherited from

Command.description

#### Defined in

[src/bluehawk/commands/Command.ts:12](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L12)

___

### name

• **name**: `string`

#### Inherited from

Command.name

#### Defined in

[src/bluehawk/commands/Command.ts:9](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L9)

___

### rules

• `Optional` **rules**: `Rule`[]

#### Inherited from

Command.rules

#### Defined in

[src/bluehawk/commands/Command.ts:19](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L19)

___

### supportsBlockMode

• **supportsBlockMode**: `boolean`

#### Defined in

[src/bluehawk/commands/Command.ts:26](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L26)

___

### supportsLineMode

• **supportsLineMode**: `boolean`

#### Defined in

[src/bluehawk/commands/Command.ts:27](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L27)

## Methods

### process

▸ **process**(`request`): `NotPromise`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ProcessRequest`](ProcessRequest)<[`AnyCommandNode`](../modules#anycommandnode)\> |

#### Returns

`NotPromise`

#### Defined in

[src/bluehawk/commands/Command.ts:28](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/commands/Command.ts#L28)
