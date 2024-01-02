---
id: "Bluehawk"
title: "Class: Bluehawk"
sidebar_label: "Bluehawk"
sidebar_position: 0
custom_edit_url: null
---

The frontend of Bluehawk.

## Constructors

### constructor

• **new Bluehawk**(`configuration?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration?` | `BluehawkConfiguration` |

#### Defined in

[src/bluehawk/bluehawk.ts:44](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L44)

## Properties

### \_parserStore

• `Private` **\_parserStore**: `ParserStore`

#### Defined in

[src/bluehawk/bluehawk.ts:227](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L227)

___

### \_processor

• `Private` **\_processor**: `Processor`

#### Defined in

[src/bluehawk/bluehawk.ts:226](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L226)

## Accessors

### processor

• `get` **processor**(): `Processor`

#### Returns

`Processor`

#### Defined in

[src/bluehawk/bluehawk.ts:222](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L222)

## Methods

### addLanguage

▸ **addLanguage**(`forFileExtension`, `languageSpecification`): `void`

Specify the special patterns for a given language.

#### Parameters

| Name | Type |
| :------ | :------ |
| `forFileExtension` | `string` \| `string`[] |
| `languageSpecification` | [`LanguageSpecification`](../interfaces/LanguageSpecification) |

#### Returns

`void`

#### Defined in

[src/bluehawk/bluehawk.ts:79](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L79)

___

### parse

▸ **parse**(`source`, `options?`): [`ParseResult`](../interfaces/ParseResult)

Parses the given source file into tags.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Document`](Document) |
| `options?` | `Object` |
| `options.languageSpecification?` | [`LanguageSpecification`](../interfaces/LanguageSpecification) |
| `options.reporter?` | `ActionReporter` |

#### Returns

[`ParseResult`](../interfaces/ParseResult)

#### Defined in

[src/bluehawk/bluehawk.ts:162](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L162)

___

### parseAndProcess

▸ **parseAndProcess**(`path`, `optionsIn?`): `Promise`<`void`\>

Runs through all given source paths to parse and process them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` \| `string`[] | The path or paths to the directory or files to parse and process. |
| `optionsIn?` | `ParseAndProcessOptions` | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/bluehawk.ts:92](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L92)

___

### process

▸ **process**(`parseResult`, `processOptions?`): `Promise`<`BluehawkFiles`\>

Executes the tags on the given source. Use [Bluehawk.subscribe](Bluehawk#subscribe) to get
results.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parseResult` | [`ParseResult`](../interfaces/ParseResult) |
| `processOptions?` | [`ProcessOptions`](../interfaces/ProcessOptions) |

#### Returns

`Promise`<`BluehawkFiles`\>

#### Defined in

[src/bluehawk/bluehawk.ts:215](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L215)

___

### registerTag

▸ **registerTag**(`tag`, `alternateName?`): `void`

Register the given tag on the processor and validator. This enables
support for the tag under the given name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | [`AnyTag`](../interfaces/AnyTag) |
| `alternateName?` | `string` |

#### Returns

`void`

#### Defined in

[src/bluehawk/bluehawk.ts:72](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L72)

___

### subscribe

▸ **subscribe**(`listener`): `void`

Subscribe to processed documents as they are processed by Bluehawk.

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | [`Listener`](../modules#listener) \| [`Listener`](../modules#listener)[] |

#### Returns

`void`

#### Defined in

[src/bluehawk/bluehawk.ts:203](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L203)

___

### waitForListeners

▸ **waitForListeners**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/bluehawk.ts:155](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/bluehawk.ts#L155)
