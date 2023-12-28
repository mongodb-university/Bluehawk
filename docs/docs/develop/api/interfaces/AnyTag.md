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

JSON schema of the attributes list

#### Inherited from

Tag.attributesSchema

#### Defined in

[src/bluehawk/tags/Tag.ts:21](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L21)

___

### description

• `Optional` **description**: `string`

A helpful description of what the tag is supposed to do

#### Inherited from

Tag.description

#### Defined in

[src/bluehawk/tags/Tag.ts:16](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L16)

___

### name

• **name**: `string`

The tag name. For block tags this should not include -start or
-end.

#### Inherited from

Tag.name

#### Defined in

[src/bluehawk/tags/Tag.ts:11](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L11)

___

### rules

• `Optional` **rules**: `Rule`[]

Validator rules to determine if the tag meets requirements before
processing is possible

#### Inherited from

Tag.rules

#### Defined in

[src/bluehawk/tags/Tag.ts:45](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L45)

___

### shorthandArgsAttributeName

• `Optional` **shorthandArgsAttributeName**: `string`

The attribute name that shorthand arguments map to. If not provided, then
shorthands are rejected.

Example: given shorthandArgsAttributeName = "id", the following shorthand:

```
:some-tag-start: somename somename2
```

would map to the following attribute list:

```
:some-tag-start: { "id": ["somename", "somename2"] }
```

#### Inherited from

Tag.shorthandArgsAttributeName

#### Defined in

[src/bluehawk/tags/Tag.ts:39](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L39)

___

### supportsBlockMode

• **supportsBlockMode**: `boolean`

#### Defined in

[src/bluehawk/tags/Tag.ts:52](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L52)

___

### supportsLineMode

• **supportsLineMode**: `boolean`

#### Defined in

[src/bluehawk/tags/Tag.ts:53](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L53)

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

[src/bluehawk/tags/Tag.ts:54](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L54)
