---
id: "LanguageSpecification"
title: "Interface: LanguageSpecification"
sidebar_label: "LanguageSpecification"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### blockComments

• `Optional` **blockComments**: [`RegExp`, `RegExp`][]

#### Defined in

[src/bluehawk/parser/LanguageSpecification.ts:9](https://github.com/dacharyc/Bluehawk/blob/2b37a07/src/bluehawk/parser/LanguageSpecification.ts#L9)

___

### languageId

• **languageId**: `string`

#### Defined in

[src/bluehawk/parser/LanguageSpecification.ts:3](https://github.com/dacharyc/Bluehawk/blob/2b37a07/src/bluehawk/parser/LanguageSpecification.ts#L3)

___

### lineComments

• `Optional` **lineComments**: `RegExp`[]

#### Defined in

[src/bluehawk/parser/LanguageSpecification.ts:6](https://github.com/dacharyc/Bluehawk/blob/2b37a07/src/bluehawk/parser/LanguageSpecification.ts#L6)

___

### parserPushers

• `Optional` **parserPushers**: { `endNewParserAfterPopToken?`: `boolean` ; `languageId`: `string` ; `patterns`: [`RegExp`, `RegExp`] ; `startNewParserOnPushToken?`: `boolean`  }[]

#### Defined in

[src/bluehawk/parser/LanguageSpecification.ts:22](https://github.com/dacharyc/Bluehawk/blob/2b37a07/src/bluehawk/parser/LanguageSpecification.ts#L22)

___

### stringLiterals

• `Optional` **stringLiterals**: { `multiline`: `boolean` ; `pattern`: `RegExp`  }[]

#### Defined in

[src/bluehawk/parser/LanguageSpecification.ts:13](https://github.com/dacharyc/Bluehawk/blob/2b37a07/src/bluehawk/parser/LanguageSpecification.ts#L13)
