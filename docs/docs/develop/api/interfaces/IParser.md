---
id: "IParser"
title: "Interface: IParser"
sidebar_label: "IParser"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### languageSpecification

• **languageSpecification**: [`LanguageSpecification`](LanguageSpecification.md)

#### Defined in

[bluehawk/parser/makeParser.ts:17](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/makeParser.ts#L17)

## Methods

### parse

▸ **parse**(`args`): [`ParseResult`](ParseResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.source` | [`Document`](../classes/Document.md) |
| `args.tagProcessors?` | `TagProcessors` |

#### Returns

[`ParseResult`](ParseResult.md)

#### Defined in

[bluehawk/parser/makeParser.ts:18](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/makeParser.ts#L18)
