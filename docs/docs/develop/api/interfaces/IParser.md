---
id: "IParser"
title: "Interface: IParser"
sidebar_label: "IParser"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### languageSpecification

• **languageSpecification**: [`LanguageSpecification`](LanguageSpecification)

#### Defined in

[src/bluehawk/parser/makeParser.ts:17](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/makeParser.ts#L17)

## Methods

### parse

▸ **parse**(`args`): [`ParseResult`](ParseResult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.source` | [`Document`](../classes/Document) |
| `args.tagProcessors?` | `TagProcessors` |

#### Returns

[`ParseResult`](ParseResult)

#### Defined in

[src/bluehawk/parser/makeParser.ts:18](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/makeParser.ts#L18)
