---
id: "AnyTag"
title: "Interface: AnyTag"
sidebar_label: "AnyTag"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Tag`

  ↳ **`AnyTag`**

## Properties

### attributesSchema

• `Optional` **attributesSchema**: `AnySchema`

#### Inherited from

Tag.attributesSchema

#### Defined in

[src/bluehawk/tags/Tag.ts:15](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L15)

___

### description

• `Optional` **description**: `string`

#### Inherited from

Tag.description

#### Defined in

[src/bluehawk/tags/Tag.ts:12](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L12)

___

### name

• **name**: `string`

#### Inherited from

Tag.name

#### Defined in

[src/bluehawk/tags/Tag.ts:9](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L9)

___

### rules

• `Optional` **rules**: `Rule`[]

#### Inherited from

Tag.rules

#### Defined in

[src/bluehawk/tags/Tag.ts:19](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L19)

___

### supportsBlockMode

• **supportsBlockMode**: `boolean`

#### Defined in

[src/bluehawk/tags/Tag.ts:26](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L26)

___

### supportsLineMode

• **supportsLineMode**: `boolean`

#### Defined in

[src/bluehawk/tags/Tag.ts:27](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L27)

## Methods

### process

▸ **process**(`request`): `NotPromise`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ProcessRequest`](ProcessRequest)<[`AnyTagNode`](../modules#anytagnode)\> |

#### Returns

`NotPromise`

#### Defined in

[src/bluehawk/tags/Tag.ts:28](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L28)
