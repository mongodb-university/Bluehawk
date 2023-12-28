---
id: "CopyArgs"
title: "Interface: CopyArgs"
sidebar_label: "CopyArgs"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`ActionArgs`](ActionArgs)

  ↳ **`CopyArgs`**

## Properties

### ignore

• `Optional` **ignore**: `string` \| `string`[]

#### Defined in

[src/bluehawk/actions/copy.ts:12](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L12)

___

### logLevel

• `Optional` **logLevel**: [`LogLevel`](../enums/LogLevel)

#### Inherited from

[ActionArgs](ActionArgs).[logLevel](ActionArgs#loglevel)

#### Defined in

[src/bluehawk/actions/ActionArgs.ts:3](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionArgs.ts#L3)

___

### output

• **output**: `string`

#### Defined in

[src/bluehawk/actions/copy.ts:10](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L10)

___

### rename

• `Optional` **rename**: `Record`<`string`, `string`\>

#### Defined in

[src/bluehawk/actions/copy.ts:13](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L13)

___

### rootPath

• **rootPath**: `string`

#### Defined in

[src/bluehawk/actions/copy.ts:9](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L9)

___

### state

• `Optional` **state**: `string`

#### Defined in

[src/bluehawk/actions/copy.ts:11](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L11)

___

### waitForListeners

• `Optional` **waitForListeners**: `boolean`

#### Inherited from

[ActionArgs](ActionArgs).[waitForListeners](ActionArgs#waitforlisteners)

#### Defined in

[src/bluehawk/actions/ActionArgs.ts:4](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionArgs.ts#L4)

## Methods

### onBinaryFile

▸ `Optional` **onBinaryFile**(`path`): `void` \| `Promise`<`void`\>

Hook for additional work after a binary file is processed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/copy.ts:18](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L18)
