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

### destination

• **destination**: `string`

#### Defined in

[src/bluehawk/actions/copy.ts:10](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/actions/copy.ts#L10)

___

### ignore

• `Optional` **ignore**: `string` \| `string`[]

#### Defined in

[src/bluehawk/actions/copy.ts:12](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/actions/copy.ts#L12)

___

### rootPath

• **rootPath**: `string`

#### Defined in

[src/bluehawk/actions/copy.ts:9](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/actions/copy.ts#L9)

___

### state

• `Optional` **state**: `string`

#### Defined in

[src/bluehawk/actions/copy.ts:11](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/actions/copy.ts#L11)

___

### waitForListeners

• `Optional` **waitForListeners**: `boolean`

#### Inherited from

[ActionArgs](ActionArgs).[waitForListeners](ActionArgs#waitforlisteners)

#### Defined in

[src/bluehawk/actions/ActionArgs.ts:2](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/actions/ActionArgs.ts#L2)

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

[src/bluehawk/actions/copy.ts:17](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/actions/copy.ts#L17)
