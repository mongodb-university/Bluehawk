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

• **new Bluehawk**(`configuration?`): [`Bluehawk`](Bluehawk.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration?` | `BluehawkConfiguration` |

#### Returns

[`Bluehawk`](Bluehawk.md)

#### Defined in

[bluehawk/bluehawk.ts:43](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L43)

## Properties

### \_parserStore

• `Private` **\_parserStore**: `ParserStore`

#### Defined in

[bluehawk/bluehawk.ts:221](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L221)

___

### \_processor

• `Private` **\_processor**: `Processor`

#### Defined in

[bluehawk/bluehawk.ts:220](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L220)

## Accessors

### processor

• `get` **processor**(): `Processor`

#### Returns

`Processor`

#### Defined in

[bluehawk/bluehawk.ts:216](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L216)

## Methods

### addLanguage

▸ **addLanguage**(`forFileExtension`, `languageSpecification`): `void`

Specify the special patterns for a given language.

#### Parameters

| Name | Type |
| :------ | :------ |
| `forFileExtension` | `string` \| `string`[] |
| `languageSpecification` | [`LanguageSpecification`](../interfaces/LanguageSpecification.md) |

#### Returns

`void`

#### Defined in

[bluehawk/bluehawk.ts:78](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L78)

___

### parse

▸ **parse**(`source`, `options?`): [`ParseResult`](../interfaces/ParseResult.md)

Parses the given source file into tags.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Document`](Document.md) |
| `options?` | `Object` |
| `options.languageSpecification?` | [`LanguageSpecification`](../interfaces/LanguageSpecification.md) |
| `options.reporter?` | [`ActionReporter`](../interfaces/ActionReporter.md) |

#### Returns

[`ParseResult`](../interfaces/ParseResult.md)

#### Defined in

[bluehawk/bluehawk.ts:161](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L161)

___

### parseAndProcess

▸ **parseAndProcess**(`path`, `optionsIn?`): `Promise`\<`void`\>

Runs through all given source paths to parse and process them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` \| `string`[] | The path or paths to the directory or files to parse and process. |
| `optionsIn?` | `ParseAndProcessOptions` | - |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/bluehawk.ts:91](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L91)

___

### process

▸ **process**(`parseResult`, `processOptions?`): `Promise`\<`BluehawkFiles`\>

Executes the tags on the given source. Use [[Bluehawk.subscribe]] to get
results.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parseResult` | [`ParseResult`](../interfaces/ParseResult.md) |
| `processOptions?` | [`ProcessOptions`](../interfaces/ProcessOptions.md) |

#### Returns

`Promise`\<`BluehawkFiles`\>

#### Defined in

[bluehawk/bluehawk.ts:209](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L209)

___

### registerTag

▸ **registerTag**(`tag`, `alternateName?`): `void`

Register the given tag on the processor and validator. This enables
support for the tag under the given name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | [`AnyTag`](../interfaces/AnyTag.md) |
| `alternateName?` | `string` |

#### Returns

`void`

#### Defined in

[bluehawk/bluehawk.ts:71](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L71)

___

### subscribe

▸ **subscribe**(`listener`): `void`

Subscribe to processed documents as they are processed by Bluehawk.

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | [`Listener`](../modules.md#listener) \| [`Listener`](../modules.md#listener)[] |

#### Returns

`void`

#### Defined in

[bluehawk/bluehawk.ts:197](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L197)

___

### waitForListeners

▸ **waitForListeners**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/bluehawk.ts:154](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/bluehawk.ts#L154)
