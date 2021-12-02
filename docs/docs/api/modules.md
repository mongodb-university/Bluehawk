---
id: "modules"
title: "bluehawk"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [getBluehawk](namespaces/getBluehawk)
- [tokens](namespaces/tokens)

## Classes

- [Bluehawk](classes/Bluehawk)
- [Document](classes/Document)
- [RootParser](classes/RootParser)

## Interfaces

- [ActionArgs](interfaces/ActionArgs)
- [AnyCommand](interfaces/AnyCommand)
- [BlockCommandNode](interfaces/BlockCommandNode)
- [BlockCommentTokenConfiguration](interfaces/BlockCommentTokenConfiguration)
- [CheckArgs](interfaces/CheckArgs)
- [CopyArgs](interfaces/CopyArgs)
- [EmphasizeRange](interfaces/EmphasizeRange)
- [EmphasizeSourceAttributes](interfaces/EmphasizeSourceAttributes)
- [IParser](interfaces/IParser)
- [IVisitor](interfaces/IVisitor)
- [LanguageSpecification](interfaces/LanguageSpecification)
- [LineCommandNode](interfaces/LineCommandNode)
- [ListCommandArgs](interfaces/ListCommandArgs)
- [ListStatesArgs](interfaces/ListStatesArgs)
- [ParseResult](interfaces/ParseResult)
- [PayloadQuery](interfaces/PayloadQuery)
- [ProcessOptions](interfaces/ProcessOptions)
- [ProcessRequest](interfaces/ProcessRequest)
- [Project](interfaces/Project)
- [PushParserPayload](interfaces/PushParserPayload)
- [PushParserTokenConfiguration](interfaces/PushParserTokenConfiguration)
- [SnipArgs](interfaces/SnipArgs)
- [VisitorResult](interfaces/VisitorResult)

## Type aliases

### AnyCommandNode

Ƭ **AnyCommandNode**: [`LineCommandNode`](interfaces/LineCommandNode) \| [`BlockCommandNode`](interfaces/BlockCommandNode)

#### Defined in

[src/bluehawk/parser/CommandNode.ts:64](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/CommandNode.ts#L64)

___

### IdRequiredAttributes

Ƭ **IdRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[src/bluehawk/commands/Command.ts:85](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L85)

___

### IdsRequiredAttributes

Ƭ **IdsRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[src/bluehawk/commands/Command.ts:101](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L101)

___

### Listener

Ƭ **Listener**: (`result`: `ProcessResult`) => `void` \| `Promise`<`void`\>

#### Type declaration

▸ (`result`): `void` \| `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

##### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[src/bluehawk/processor/Processor.ts:101](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/processor/Processor.ts#L101)

___

### NoAttributes

Ƭ **NoAttributes**: ``null``

#### Defined in

[src/bluehawk/commands/Command.ts:111](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L111)

___

### OnBinaryFileFunction

Ƭ **OnBinaryFileFunction**: (`file`: `string`) => `void` \| `Promise`<`void`\>

#### Type declaration

▸ (`file`): `void` \| `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |

##### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[src/bluehawk/OnBinaryFileFunction.ts:1](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/OnBinaryFileFunction.ts#L1)

## Variables

### EmphasizeCommand

• **EmphasizeCommand**: [`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/EmphasizeCommand.ts:23](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/EmphasizeCommand.ts#L23)

___

### IdRequiredAttributesSchema

• **IdRequiredAttributesSchema**: `JSONSchemaType`<[`IdRequiredAttributes`](modules#idrequiredattributes)\>

#### Defined in

[src/bluehawk/commands/Command.ts:86](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L86)

___

### IdsRequiredAttributesSchema

• **IdsRequiredAttributesSchema**: `JSONSchemaType`<[`IdsRequiredAttributes`](modules#idsrequiredattributes)\>

#### Defined in

[src/bluehawk/commands/Command.ts:102](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L102)

___

### NoAttributesSchema

• **NoAttributesSchema**: `JSONSchemaType`<[`NoAttributes`](modules#noattributes)\>

#### Defined in

[src/bluehawk/commands/Command.ts:112](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L112)

___

### RemoveCommand

• **RemoveCommand**: [`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/RemoveCommand.ts:7](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/RemoveCommand.ts#L7)

___

### ReplaceCommand

• **ReplaceCommand**: [`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/ReplaceCommand.ts:10](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/ReplaceCommand.ts#L10)

___

### SnippetCommand

• **SnippetCommand**: [`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/SnippetCommand.ts:65](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/SnippetCommand.ts#L65)

___

### StateCommand

• **StateCommand**: [`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/StateCommand.ts:9](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/StateCommand.ts#L9)

___

### System

• **System**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fs` | typeof `promises` |
| `useJsonFs` | (`directoryJson`: `DirectoryJSON`) => `void` |
| `useMemfs` | () => `void` |
| `useRealfs` | () => `void` |

#### Defined in

[src/bluehawk/io/System.ts:7](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/io/System.ts#L7)

___

### UncommentCommand

• **UncommentCommand**: [`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/UncommentCommand.ts:6](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/UncommentCommand.ts#L6)

___

### getBluehawk

• **getBluehawk**: `Object`

#### Call signature

▸ (): `Promise`<[`Bluehawk`](classes/Bluehawk)\>

Returns a standard, shared Bluehawk instance.

##### Returns

`Promise`<[`Bluehawk`](classes/Bluehawk)\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reset` | () => `Promise`<[`Bluehawk`](classes/Bluehawk)\> |

#### Defined in

[src/bluehawk/getBluehawk.ts:22](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/getBluehawk.ts#L22)

## Functions

### check

▸ `Const` **check**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`CheckArgs`](interfaces/CheckArgs) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/check.ts:13](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/check.ts#L13)

___

### copy

▸ `Const` **copy**(`args`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`CopyArgs`](interfaces/CopyArgs) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/bluehawk/actions/copy.ts:20](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/copy.ts#L20)

___

### createFormattedCodeBlock

▸ `Const` **createFormattedCodeBlock**(`result`, `destination`, `format`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |
| `destination` | `string` |
| `format` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/snip.ts:17](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/snip.ts#L17)

___

### flatten

▸ **flatten**<`T`\>(`node`): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `T` |

#### Returns

`T`[]

#### Defined in

[src/bluehawk/parser/flatten.ts:2](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/flatten.ts#L2)

___

### formatInRst

▸ `Const` **formatInRst**(`result`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[src/bluehawk/actions/snip.ts:34](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/snip.ts#L34)

___

### listCommands

▸ `Const` **listCommands**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ListCommandArgs`](interfaces/ListCommandArgs) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/listCommands.ts:9](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/listCommands.ts#L9)

___

### listStates

▸ `Const` **listStates**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ListStatesArgs`](interfaces/ListStatesArgs) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/listStates.ts:11](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/listStates.ts#L11)

___

### loadProjectPaths

▸ **loadProjectPaths**(`project`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | [`Project`](interfaces/Project) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/bluehawk/project/loadProjectPaths.ts:56](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/project/loadProjectPaths.ts#L56)

___

### makeBlockCommand

▸ **makeBlockCommand**<`AttributesType`\>(`command`): [`AnyCommand`](interfaces/AnyCommand)

#### Type parameters

| Name |
| :------ |
| `AttributesType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `Command` & { `attributesSchema`: `JSONSchemaType`<`AttributesType`, ``false``\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`BlockCommandNode`](interfaces/BlockCommandNode)\>) => `NotPromise`  } |

#### Returns

[`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/Command.ts:34](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L34)

___

### makeBlockCommentTokens

▸ **makeBlockCommentTokens**(`startPattern`, `endPattern`, `configuration?`): [`TokenType`, `TokenType`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `startPattern` | `RegExp` |
| `endPattern` | `RegExp` |
| `configuration?` | [`BlockCommentTokenConfiguration`](interfaces/BlockCommentTokenConfiguration) |

#### Returns

[`TokenType`, `TokenType`]

#### Defined in

[src/bluehawk/parser/lexer/makeBlockCommentTokens.ts:9](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/lexer/makeBlockCommentTokens.ts#L9)

___

### makeBlockOrLineCommand

▸ **makeBlockOrLineCommand**<`AttributesType`\>(`command`): [`AnyCommand`](interfaces/AnyCommand)

#### Type parameters

| Name |
| :------ |
| `AttributesType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `Command` & { `attributesSchema`: `JSONSchemaType`<`AttributesType`, ``false``\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`AnyCommandNode`](modules#anycommandnode)\>) => `NotPromise`  } |

#### Returns

[`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/Command.ts:67](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L67)

___

### makeCstVisitor

▸ **makeCstVisitor**(`parser`, `getParser?`): [`IVisitor`](interfaces/IVisitor)

#### Parameters

| Name | Type |
| :------ | :------ |
| `parser` | [`RootParser`](classes/RootParser) |
| `getParser?` | (`parserId`: `string`) => `undefined` \| [`IVisitor`](interfaces/IVisitor) |

#### Returns

[`IVisitor`](interfaces/IVisitor)

#### Defined in

[src/bluehawk/parser/visitor/makeCstVisitor.ts:48](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/visitor/makeCstVisitor.ts#L48)

___

### makeLineCommand

▸ **makeLineCommand**(`command`): [`AnyCommand`](interfaces/AnyCommand)

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `Command` & { `attributesSchema?`: `undefined` ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`LineCommandNode`](interfaces/LineCommandNode)\>) => `NotPromise`  } |

#### Returns

[`AnyCommand`](interfaces/AnyCommand)

#### Defined in

[src/bluehawk/commands/Command.ts:51](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/Command.ts#L51)

___

### makeLineCommentToken

▸ **makeLineCommentToken**(`pattern`): `TokenType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `RegExp` |

#### Returns

`TokenType`

#### Defined in

[src/bluehawk/parser/lexer/makeLineCommentToken.ts:4](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/lexer/makeLineCommentToken.ts#L4)

___

### makeParser

▸ **makeParser**(`languageSpecification`): [`IParser`](interfaces/IParser)

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageSpecification` | [`LanguageSpecification`](interfaces/LanguageSpecification) |

#### Returns

[`IParser`](interfaces/IParser)

#### Defined in

[src/bluehawk/parser/makeParser.ts:27](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/makeParser.ts#L27)

___

### makePayloadPattern

▸ **makePayloadPattern**<`PayloadType`\>(`pattern`, `getPayload`): `ICustomPattern`

#### Type parameters

| Name |
| :------ |
| `PayloadType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `RegExp` |
| `getPayload` | (`query`: [`PayloadQuery`](interfaces/PayloadQuery)) => `PayloadType` |

#### Returns

`ICustomPattern`

#### Defined in

[src/bluehawk/parser/lexer/makePayloadPattern.ts:20](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/lexer/makePayloadPattern.ts#L20)

___

### makePushParserTokens

▸ **makePushParserTokens**(`pushPattern`, `popPattern`, `configuration`): [`TokenType`, `TokenType`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pushPattern` | `RegExp` |
| `popPattern` | `RegExp` |
| `configuration` | [`PushParserTokenConfiguration`](interfaces/PushParserTokenConfiguration) |

#### Returns

[`TokenType`, `TokenType`]

#### Defined in

[src/bluehawk/parser/lexer/makePushParserTokens.ts:19](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/parser/lexer/makePushParserTokens.ts#L19)

___

### removeMetaRange

▸ **removeMetaRange**(`s`, `commandNode`): `MagicString`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `default` |
| `commandNode` | [`AnyCommandNode`](modules#anycommandnode) |

#### Returns

`MagicString`

#### Defined in

[src/bluehawk/commands/removeMetaRange.ts:25](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/commands/removeMetaRange.ts#L25)

___

### snip

▸ `Const` **snip**(`args`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`SnipArgs`](interfaces/SnipArgs) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/bluehawk/actions/snip.ts:100](https://github.com/mongodben/Bluehawk/blob/b4aa3c0/src/bluehawk/actions/snip.ts#L100)
