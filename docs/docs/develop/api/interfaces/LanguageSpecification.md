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

[bluehawk/parser/LanguageSpecification.ts:9](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/LanguageSpecification.ts#L9)

___

### languageId

• **languageId**: `string`

#### Defined in

[bluehawk/parser/LanguageSpecification.ts:3](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/LanguageSpecification.ts#L3)

___

### lineComments

• `Optional` **lineComments**: `RegExp`[]

#### Defined in

[bluehawk/parser/LanguageSpecification.ts:6](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/LanguageSpecification.ts#L6)

___

### parserPushers

• `Optional` **parserPushers**: \{ `endNewParserAfterPopToken?`: `boolean` ; `languageId`: `string` ; `patterns`: [`RegExp`, `RegExp`] ; `startNewParserOnPushToken?`: `boolean`  }[]

#### Defined in

[bluehawk/parser/LanguageSpecification.ts:22](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/LanguageSpecification.ts#L22)

___

### stringLiterals

• `Optional` **stringLiterals**: \{ `multiline`: `boolean` ; `pattern`: `RegExp`  }[]

#### Defined in

[bluehawk/parser/LanguageSpecification.ts:13](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/LanguageSpecification.ts#L13)
