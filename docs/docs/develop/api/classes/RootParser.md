---
id: "RootParser"
title: "Class: RootParser"
sidebar_label: "RootParser"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `unknown`

  ↳ **`RootParser`**

## Constructors

### constructor

• **new RootParser**(`languageTokens`, `languageSpecification?`): [`RootParser`](RootParser.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageTokens` | `TokenType`[] |
| `languageSpecification?` | [`LanguageSpecification`](../interfaces/LanguageSpecification.md) |

#### Returns

[`RootParser`](RootParser.md)

#### Overrides

CstParser.constructor

#### Defined in

[bluehawk/parser/RootParser.ts:103](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L103)

## Properties

### \_bluehawkErrors

• `Private` **\_bluehawkErrors**: `BluehawkError`[] = `[]`

#### Defined in

[bluehawk/parser/RootParser.ts:325](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L325)

___

### annotatedText

• **annotatedText**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:91](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L91)

___

### attributeList

• **attributeList**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:99](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L99)

___

### blockComment

• **blockComment**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:97](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L97)

___

### blockTag

• **blockTag**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:93](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L93)

___

### blockTagUncommentedContents

• **blockTagUncommentedContents**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:94](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L94)

___

### chunk

• **chunk**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:92](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L92)

___

### languageSpecification

• `Optional` **languageSpecification**: [`LanguageSpecification`](../interfaces/LanguageSpecification.md)

#### Defined in

[bluehawk/parser/RootParser.ts:101](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L101)

___

### lexer

• **lexer**: `Lexer`

#### Defined in

[bluehawk/parser/RootParser.ts:89](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L89)

___

### lineComment

• **lineComment**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:98](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L98)

___

### pushParser

• **pushParser**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:100](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L100)

___

### tag

• **tag**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:95](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L95)

___

### tagAttribute

• **tagAttribute**: `Rule` = `UndefinedRule`

#### Defined in

[bluehawk/parser/RootParser.ts:96](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L96)

## Methods

### parse

▸ **parse**(`text`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cst?` | `any` |
| `errors` | `BluehawkError`[] |

#### Defined in

[bluehawk/parser/RootParser.ts:275](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/RootParser.ts#L275)
