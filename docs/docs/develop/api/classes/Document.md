---
id: "Document"
title: "Class: Document"
sidebar_label: "Document"
sidebar_position: 0
custom_edit_url: null
---

Represents a file either before or after processing.

## Constructors

### constructor

• **new Document**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.attributes?` | `TagAttributes` |
| `__namedParameters.modifiers?` | `Object` |
| `__namedParameters.path` | `string` |
| `__namedParameters.text` | `string` \| `default` |

#### Defined in

[src/bluehawk/Document.ts:100](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L100)

## Properties

### \_sourceMapConsumer

• `Private` `Optional` **\_sourceMapConsumer**: `SourceMapConsumer`

#### Defined in

[src/bluehawk/Document.ts:167](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L167)

___

### attributes

• **attributes**: `TagAttributes`

Attributes that a tag can store information in for later processing by
listeners.

These do not affect the identity of the document.

#### Defined in

[src/bluehawk/Document.ts:70](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L70)

___

### id

• `Readonly` **id**: `string`

The path and modifiers of the file form a way to identify this specific
instance of a file.

A file at one path may result in multiple output files after processing
(e.g. states).

#### Defined in

[src/bluehawk/Document.ts:41](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L41)

___

### modifiers

• `Readonly` **modifiers**: `Object`

Read-only attributes that contribute to the document's identity. Do not
modify after the document's creation.

A file at one path may result in multiple output files after processing
(e.g. states). Different instances of the same file can be distinguished
with modifiers.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[src/bluehawk/Document.ts:62](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L62)

___

### path

• **path**: `string`

The original path of the document.

#### Defined in

[src/bluehawk/Document.ts:52](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L52)

___

### text

• **text**: `default`

The source text as a conveniently editable magic string. See
https://www.npmjs.com/package/magic-string for details.

#### Defined in

[src/bluehawk/Document.ts:47](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L47)

## Accessors

### basename

• `get` **basename**(): `string`

Returns the name of the file with the file extension, if any.

#### Returns

`string`

#### Defined in

[src/bluehawk/Document.ts:82](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L82)

___

### dirname

• `get` **dirname**(): `string`

Returns the path of the directory containing this file based on the path.

#### Returns

`string`

#### Defined in

[src/bluehawk/Document.ts:96](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L96)

___

### extension

• `get` **extension**(): `string`

Returns the file extension, if any, including the dot.

#### Returns

`string`

#### Defined in

[src/bluehawk/Document.ts:89](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L89)

___

### name

• `get` **name**(): `string`

Returns the name of the file minus the file extension.

#### Returns

`string`

#### Defined in

[src/bluehawk/Document.ts:75](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L75)

## Methods

### getNewLocationFor

▸ **getNewLocationFor**(`oldLocation`): `Promise`<`undefined` \| { `column`: `number` ; `line`: `number`  }\>

Calculates the new position of the original line and column numbers.

Offset is ignored. This should only be done after all text transformations
are finalized.

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldLocation` | `Object` |
| `oldLocation.column` | `number` |
| `oldLocation.line` | `number` |

#### Returns

`Promise`<`undefined` \| { `column`: `number` ; `line`: `number`  }\>

#### Defined in

[src/bluehawk/Document.ts:136](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L136)

___

### pathWithInfix

▸ **pathWithInfix**(`infix`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `infix` | `string` |

#### Returns

`string`

#### Defined in

[src/bluehawk/Document.ts:126](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L126)

___

### makeId

▸ `Static` **makeId**(`newPath`, `modifiers?`): `string`

Returns a uniform path + modifier combination to uniquely identify a file
instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `newPath` | `string` |
| `modifiers?` | `Object` |

#### Returns

`string`

#### Defined in

[src/bluehawk/Document.ts:16](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Document.ts#L16)
