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

[src/bluehawk/bluehawk.ts:41](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L41)

## Properties

### \_parserStore

• `Private` **\_parserStore**: `ParserStore`

#### Defined in

[src/bluehawk/bluehawk.ts:204](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L204)

___

### \_processor

• `Private` **\_processor**: `Processor`

#### Defined in

[src/bluehawk/bluehawk.ts:203](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L203)

## Accessors

### processor

• `get` **processor**(): `Processor`

#### Returns

`Processor`

#### Defined in

[src/bluehawk/bluehawk.ts:199](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L199)

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

[src/bluehawk/bluehawk.ts:76](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L76)

___

### parse

▸ **parse**(`source`, `languageSpecification?`): [`ParseResult`](../interfaces/ParseResult)

Parses the given source file into commands.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Document`](Document) |
| `languageSpecification?` | [`LanguageSpecification`](../interfaces/LanguageSpecification) |

#### Returns

[`ParseResult`](../interfaces/ParseResult)

#### Defined in

[src/bluehawk/bluehawk.ts:144](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L144)

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

[src/bluehawk/bluehawk.ts:89](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L89)

___

### process

▸ **process**(`parseResult`, `processOptions?`): `Promise`<`BluehawkFiles`\>

Executes the commands on the given source. Use [Bluehawk.subscribe](Bluehawk#subscribe) to get
results.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parseResult` | [`ParseResult`](../interfaces/ParseResult) |
| `processOptions?` | [`ProcessOptions`](../interfaces/ProcessOptions) |

#### Returns

`Promise`<`BluehawkFiles`\>

#### Defined in

[src/bluehawk/bluehawk.ts:192](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L192)

___

### registerCommand

▸ **registerCommand**(`command`, `alternateName?`): `void`

Register the given command on the processor and validator. This enables
support for the command under the given name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`AnyCommand`](../interfaces/AnyCommand) |
| `alternateName?` | `string` |

#### Returns

`void`

#### Defined in

[src/bluehawk/bluehawk.ts:69](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L69)

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

[src/bluehawk/bluehawk.ts:180](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/bluehawk.ts#L180)
