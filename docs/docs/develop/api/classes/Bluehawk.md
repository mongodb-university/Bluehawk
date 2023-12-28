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

[src/bluehawk/bluehawk.ts:42](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L42)

## Properties

### \_parserStore

• `Private` **\_parserStore**: `ParserStore`

#### Defined in

[src/bluehawk/bluehawk.ts:220](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L220)

___

### \_processor

• `Private` **\_processor**: `Processor`

#### Defined in

[src/bluehawk/bluehawk.ts:219](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L219)

## Accessors

### processor

• `get` **processor**(): `Processor`

#### Returns

`Processor`

#### Defined in

[src/bluehawk/bluehawk.ts:215](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L215)

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

[src/bluehawk/bluehawk.ts:77](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L77)

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
| `options.reporter?` | [`ActionReporter`](../interfaces/ActionReporter) |

#### Returns

[`ParseResult`](../interfaces/ParseResult)

#### Defined in

[src/bluehawk/bluehawk.ts:160](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L160)

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

[src/bluehawk/bluehawk.ts:90](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L90)

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

[src/bluehawk/bluehawk.ts:208](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L208)

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

[src/bluehawk/bluehawk.ts:70](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L70)

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

[src/bluehawk/bluehawk.ts:196](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L196)

___

### waitForListeners

▸ **waitForListeners**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/bluehawk.ts:153](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/bluehawk.ts#L153)
