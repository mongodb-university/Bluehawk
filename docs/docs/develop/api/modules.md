---
id: "modules"
title: "bluehawk"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [tokens](namespaces/tokens.md)

## Enumerations

- [LogLevel](enums/LogLevel.md)

## Classes

- [Bluehawk](classes/Bluehawk.md)
- [ConsoleActionReporter](classes/ConsoleActionReporter.md)
- [Document](classes/Document.md)
- [RootParser](classes/RootParser.md)

## Interfaces

- [ActionArgs](interfaces/ActionArgs.md)
- [ActionReporter](interfaces/ActionReporter.md)
- [AnyTag](interfaces/AnyTag.md)
- [BlockCommentTokenConfiguration](interfaces/BlockCommentTokenConfiguration.md)
- [BlockTagNode](interfaces/BlockTagNode.md)
- [CheckArgs](interfaces/CheckArgs.md)
- [CheckResult](interfaces/CheckResult.md)
- [CopyArgs](interfaces/CopyArgs.md)
- [EmphasizeRange](interfaces/EmphasizeRange.md)
- [EmphasizeSourceAttributes](interfaces/EmphasizeSourceAttributes.md)
- [IParser](interfaces/IParser.md)
- [IVisitor](interfaces/IVisitor.md)
- [LanguageSpecification](interfaces/LanguageSpecification.md)
- [LineTagNode](interfaces/LineTagNode.md)
- [ListStatesArgs](interfaces/ListStatesArgs.md)
- [ListTagArgs](interfaces/ListTagArgs.md)
- [ParseResult](interfaces/ParseResult.md)
- [PayloadQuery](interfaces/PayloadQuery.md)
- [PluginArgs](interfaces/PluginArgs.md)
- [ProcessOptions](interfaces/ProcessOptions.md)
- [ProcessRequest](interfaces/ProcessRequest.md)
- [Project](interfaces/Project.md)
- [PushParserPayload](interfaces/PushParserPayload.md)
- [PushParserTokenConfiguration](interfaces/PushParserTokenConfiguration.md)
- [SnipArgs](interfaces/SnipArgs.md)
- [VisitorResult](interfaces/VisitorResult.md)

## Type Aliases

### AnyTagNode

Ƭ **AnyTagNode**: [`LineTagNode`](interfaces/LineTagNode.md) \| [`BlockTagNode`](interfaces/BlockTagNode.md)

#### Defined in

[bluehawk/parser/TagNode.ts:63](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/TagNode.ts#L63)

___

### BinaryFileEvent

Ƭ **BinaryFileEvent**: [`FileEvent`](modules.md#fileevent)

#### Defined in

[bluehawk/actions/ActionReporter.ts:51](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L51)

___

### BluehawkErrorsEvent

Ƭ **BluehawkErrorsEvent**: [`FileEvent`](modules.md#fileevent) & \{ `errors`: `BluehawkError`[]  }

#### Defined in

[bluehawk/actions/ActionReporter.ts:90](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L90)

___

### CopyArgsCli

Ƭ **CopyArgsCli**: `Omit`\<[`CopyArgs`](interfaces/CopyArgs.md), ``"rename"``\> & \{ `rename?`: `string`  }

#### Defined in

[bluehawk/actions/copy.ts:22](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/copy.ts#L22)

___

### FileErrorEvent

Ƭ **FileErrorEvent**: [`FileEvent`](modules.md#fileevent) & \{ `error`: `Error`  }

#### Defined in

[bluehawk/actions/ActionReporter.ts:82](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L82)

___

### FileEvent

Ƭ **FileEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputPath` | `string` |

#### Defined in

[bluehawk/actions/ActionReporter.ts:47](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L47)

___

### FileParsedEvent

Ƭ **FileParsedEvent**: [`FileEvent`](modules.md#fileevent) & \{ `parseResult`: [`ParseResult`](interfaces/ParseResult.md)  }

#### Defined in

[bluehawk/actions/ActionReporter.ts:53](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L53)

___

### FileWrittenEvent

Ƭ **FileWrittenEvent**: [`FileEvent`](modules.md#fileevent) & \{ `outputPath`: `string` ; `type`: ``"text"`` \| ``"binary"``  }

#### Defined in

[bluehawk/actions/ActionReporter.ts:57](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L57)

___

### IdRequiredAttributes

Ƭ **IdRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[bluehawk/tags/Tag.ts:115](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L115)

___

### IdsRequiredAttributes

Ƭ **IdsRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[bluehawk/tags/Tag.ts:131](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L131)

___

### IdsUnusedEvent

Ƭ **IdsUnusedEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ids` | `string`[] |
| `paths` | `string`[] |

#### Defined in

[bluehawk/actions/ActionReporter.ts:73](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L73)

___

### Listener

Ƭ **Listener**: (`result`: `ProcessResult`) => `void` \| `Promise`\<`void`\>

#### Type declaration

▸ (`result`): `void` \| `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

##### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[bluehawk/processor/Processor.ts:102](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/processor/Processor.ts#L102)

___

### LoadedPlugin

Ƭ **LoadedPlugin**: [`Plugin`](modules.md#plugin) & \{ `path`: `string`  }

#### Defined in

[bluehawk/Plugin.ts:34](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L34)

___

### NoAttributes

Ƭ **NoAttributes**: ``null``

#### Defined in

[bluehawk/tags/Tag.ts:141](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L141)

___

### OnBinaryFileFunction

Ƭ **OnBinaryFileFunction**: (`file`: `string`) => `void` \| `Promise`\<`void`\>

#### Type declaration

▸ (`file`): `void` \| `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |

##### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[bluehawk/OnBinaryFileFunction.ts:1](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/OnBinaryFileFunction.ts#L1)

___

### ParserNotFoundEvent

Ƭ **ParserNotFoundEvent**: [`FileEvent`](modules.md#fileevent) & \{ `error`: `Error`  }

#### Defined in

[bluehawk/actions/ActionReporter.ts:78](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L78)

___

### Plugin

Ƭ **Plugin**: `Object`

A plugin is a Node module that exports a register() function.

A plugin can be a simple JS file or a transpiled Node module, as long as it
exports the register() function:

```js
  // MyPlugin.js
  exports.register = (args) => {
    // Add a new CLI option
    args.yargs.option("myNewOption", { string: true });

    // Add Bluehawk listener
    args.bluehawk.subscribe((result) => {
      console.log("Plugin called for file", result.document.path);
    });
  };
```

You can then call `bluehawk --plugin /path/to/MyPlugin.js` to use the plugin.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `register` | (`args`: [`PluginArgs`](interfaces/PluginArgs.md)) => `void` \| `Promise`\<`void`\> |

#### Defined in

[bluehawk/Plugin.ts:26](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L26)

___

### StateNotFoundEvent

Ƭ **StateNotFoundEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `paths` | `string`[] |
| `state` | `string` |

#### Defined in

[bluehawk/actions/ActionReporter.ts:68](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L68)

___

### StatesFoundEvent

Ƭ **StatesFoundEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `action` | `string` |
| `paths` | `string`[] |
| `statesFound` | `string`[] |

#### Defined in

[bluehawk/actions/ActionReporter.ts:62](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L62)

___

### WithActionReporter

Ƭ **WithActionReporter**\<`T`\>: `T` & \{ `reporter`: [`ActionReporter`](interfaces/ActionReporter.md)  }

Creates a type with a required ActionReporter field.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[bluehawk/actions/ActionReporter.ts:7](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L7)

___

### WriteFailedEvent

Ƭ **WriteFailedEvent**: [`FileWrittenEvent`](modules.md#filewrittenevent) & \{ `error`: `Error`  }

#### Defined in

[bluehawk/actions/ActionReporter.ts:86](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L86)

## Variables

### EmphasizeTag

• `Const` **EmphasizeTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/EmphasizeTag.ts:19](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/EmphasizeTag.ts#L19)

___

### IdRequiredAttributesSchema

• `Const` **IdRequiredAttributesSchema**: `JSONSchemaType`\<[`IdRequiredAttributes`](modules.md#idrequiredattributes)\>

#### Defined in

[bluehawk/tags/Tag.ts:116](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L116)

___

### IdsRequiredAttributesSchema

• `Const` **IdsRequiredAttributesSchema**: `JSONSchemaType`\<[`IdsRequiredAttributes`](modules.md#idsrequiredattributes)\>

#### Defined in

[bluehawk/tags/Tag.ts:132](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L132)

___

### NoAttributesSchema

• `Const` **NoAttributesSchema**: `JSONSchemaType`\<[`NoAttributes`](modules.md#noattributes)\>

#### Defined in

[bluehawk/tags/Tag.ts:142](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L142)

___

### RENAME\_ERR

• `Const` **RENAME\_ERR**: ``"Rename flag does not support specifying a path argument. If you would like to see this functionality, please submit an issue or pull request."``

#### Defined in

[bluehawk/actions/copy.ts:24](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/copy.ts#L24)

___

### RemoveTag

• `Const` **RemoveTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/RemoveTag.ts:3](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/RemoveTag.ts#L3)

___

### ReplaceTag

• `Const` **ReplaceTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/ReplaceTag.ts:10](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/ReplaceTag.ts#L10)

___

### SnippetTag

• `Const` **SnippetTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/SnippetTag.ts:65](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/SnippetTag.ts#L65)

___

### StateRemoveTag

• `Const` **StateRemoveTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/StateRemoveTag.ts:9](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/StateRemoveTag.ts#L9)

___

### StateTag

• `Const` **StateTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/StateTag.ts:10](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/StateTag.ts#L10)

___

### System

• `Const` **System**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fs` | `any` |
| `useJsonFs` | (`directoryJson`: `DirectoryJSON`) => `void` |
| `useMemfs` | () => `void` |
| `useRealfs` | () => `void` |

#### Defined in

[bluehawk/io/System.ts:7](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/io/System.ts#L7)

___

### UncommentTag

• `Const` **UncommentTag**: [`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/UncommentTag.ts:6](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/UncommentTag.ts#L6)

## Functions

### check

▸ **check**(`args`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules.md#withactionreporter)\<[`CheckArgs`](interfaces/CheckArgs.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/actions/check.ts:15](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/check.ts#L15)

___

### commandDir

▸ **commandDir**\<`T`\>(`argv`, `directory`, `options?`): `yargs.Argv`\<`T`\>

Loads a directory as yargs commands while supporting TypeScript for development.
See yargs.commandDir().

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `Argv`\<`T`\> |
| `directory` | `string` |
| `options?` | `any` |

#### Returns

`yargs.Argv`\<`T`\>

#### Defined in

[bluehawk/Plugin.ts:106](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L106)

___

### conditionalForkWithState

▸ **conditionalForkWithState**(`request`): `void`

If we are not processing in a state file, fork a file for each
state listed in our tag node.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ProcessRequest`](interfaces/ProcessRequest.md)\<[`BlockTagNode`](interfaces/BlockTagNode.md)\> |

#### Returns

`void`

#### Defined in

[bluehawk/tags/StateTag.ts:31](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/StateTag.ts#L31)

___

### copy

▸ **copy**(`args`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules.md#withactionreporter)\<[`CopyArgs`](interfaces/CopyArgs.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/actions/copy.ts:27](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/copy.ts#L27)

___

### createFormattedCodeBlock

▸ **createFormattedCodeBlock**(`«destructured»`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `format` | `string` |
| › `output` | `string` |
| › `reporter` | [`ActionReporter`](interfaces/ActionReporter.md) |
| › `result` | `ProcessResult` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/actions/snip.ts:20](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/snip.ts#L20)

___

### flatten

▸ **flatten**\<`T`\>(`node`): `T`[]

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

[bluehawk/parser/flatten.ts:2](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/flatten.ts#L2)

___

### formatInDocusaurus

▸ **formatInDocusaurus**(`result`): `Promise`\<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

[bluehawk/actions/snip.ts:167](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/snip.ts#L167)

___

### formatInMd

▸ **formatInMd**(`result`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

#### Returns

`undefined` \| `string`

#### Defined in

[bluehawk/actions/snip.ts:154](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/snip.ts#L154)

___

### formatInRst

▸ **formatInRst**(`result`): `Promise`\<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

[bluehawk/actions/snip.ts:75](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/snip.ts#L75)

___

### getBluehawk

▸ **getBluehawk**(): `Promise`\<[`Bluehawk`](classes/Bluehawk.md)\>

Returns a standard, shared Bluehawk instance.

#### Returns

`Promise`\<[`Bluehawk`](classes/Bluehawk.md)\>

#### Defined in

[bluehawk/getBluehawk.ts:23](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/getBluehawk.ts#L23)

___

### listStates

▸ **listStates**(`args`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules.md#withactionreporter)\<[`ListStatesArgs`](interfaces/ListStatesArgs.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/actions/listStates.ts:12](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/listStates.ts#L12)

___

### listTags

▸ **listTags**(`args`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ListTagArgs`](interfaces/ListTagArgs.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/actions/listTags.ts:9](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/listTags.ts#L9)

___

### loadPlugins

▸ **loadPlugins**(`path`): `Promise`\<[`LoadedPlugin`](modules.md#loadedplugin)[]\>

Load the given plugin(s).

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `undefined` \| `string` \| `string`[] |

#### Returns

`Promise`\<[`LoadedPlugin`](modules.md#loadedplugin)[]\>

#### Defined in

[bluehawk/Plugin.ts:71](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/Plugin.ts#L71)

___

### loadProjectPaths

▸ **loadProjectPaths**(`project`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | [`Project`](interfaces/Project.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[bluehawk/project/loadProjectPaths.ts:56](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/project/loadProjectPaths.ts#L56)

___

### makeBlockCommentTokens

▸ **makeBlockCommentTokens**(`startPattern`, `endPattern`, `configuration?`): [`TokenType`, `TokenType`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `startPattern` | `RegExp` |
| `endPattern` | `RegExp` |
| `configuration?` | [`BlockCommentTokenConfiguration`](interfaces/BlockCommentTokenConfiguration.md) |

#### Returns

[`TokenType`, `TokenType`]

#### Defined in

[bluehawk/parser/lexer/makeBlockCommentTokens.ts:9](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/lexer/makeBlockCommentTokens.ts#L9)

___

### makeBlockOrLineTag

▸ **makeBlockOrLineTag**\<`AttributesType`\>(`tag`): [`AnyTag`](interfaces/AnyTag.md)

#### Type parameters

| Name |
| :------ |
| `AttributesType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Tag` & \{ `attributesSchema`: `JSONSchemaType`\<`AttributesType`\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest.md)\<[`AnyTagNode`](modules.md#anytagnode)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/Tag.ts:93](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L93)

___

### makeBlockTag

▸ **makeBlockTag**\<`AttributesType`\>(`tag`): [`AnyTag`](interfaces/AnyTag.md)

#### Type parameters

| Name |
| :------ |
| `AttributesType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Tag` & \{ `attributesSchema`: `JSONSchemaType`\<`AttributesType`\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest.md)\<[`BlockTagNode`](interfaces/BlockTagNode.md)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/Tag.ts:60](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L60)

___

### makeCstVisitor

▸ **makeCstVisitor**(`parser`, `getParser?`): [`IVisitor`](interfaces/IVisitor.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `parser` | [`RootParser`](classes/RootParser.md) |
| `getParser?` | (`parserId`: `string`) => `undefined` \| [`IVisitor`](interfaces/IVisitor.md) |

#### Returns

[`IVisitor`](interfaces/IVisitor.md)

#### Defined in

[bluehawk/parser/visitor/makeCstVisitor.ts:44](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/visitor/makeCstVisitor.ts#L44)

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

[bluehawk/parser/lexer/makeLineCommentToken.ts:4](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/lexer/makeLineCommentToken.ts#L4)

___

### makeLineTag

▸ **makeLineTag**(`tag`): [`AnyTag`](interfaces/AnyTag.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Tag` & \{ `attributesSchema?`: `undefined` ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest.md)\<[`LineTagNode`](interfaces/LineTagNode.md)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag.md)

#### Defined in

[bluehawk/tags/Tag.ts:77](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L77)

___

### makeParser

▸ **makeParser**(`languageSpecification`): [`IParser`](interfaces/IParser.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageSpecification` | [`LanguageSpecification`](interfaces/LanguageSpecification.md) |

#### Returns

[`IParser`](interfaces/IParser.md)

#### Defined in

[bluehawk/parser/makeParser.ts:29](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/makeParser.ts#L29)

___

### makePayloadPattern

▸ **makePayloadPattern**\<`PayloadType`\>(`pattern`, `getPayload`): `ICustomPattern`

#### Type parameters

| Name |
| :------ |
| `PayloadType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `RegExp` |
| `getPayload` | (`query`: [`PayloadQuery`](interfaces/PayloadQuery.md)) => `PayloadType` |

#### Returns

`ICustomPattern`

#### Defined in

[bluehawk/parser/lexer/makePayloadPattern.ts:20](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/lexer/makePayloadPattern.ts#L20)

___

### makePushParserTokens

▸ **makePushParserTokens**(`pushPattern`, `popPattern`, `configuration`): [`TokenType`, `TokenType`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pushPattern` | `RegExp` |
| `popPattern` | `RegExp` |
| `configuration` | [`PushParserTokenConfiguration`](interfaces/PushParserTokenConfiguration.md) |

#### Returns

[`TokenType`, `TokenType`]

#### Defined in

[bluehawk/parser/lexer/makePushParserTokens.ts:19](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/lexer/makePushParserTokens.ts#L19)

___

### mapShorthandArgsToAttributes

▸ **mapShorthandArgsToAttributes**(`«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `shorthandArgsAttributeName?` | `string` |
| › `tagNode` | [`AnyTagNode`](modules.md#anytagnode) |

#### Returns

`void`

#### Defined in

[bluehawk/tags/Tag.ts:147](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/Tag.ts#L147)

___

### removeMetaRange

▸ **removeMetaRange**(`s`, `tagNode`): `MagicString`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `MagicString` |
| `tagNode` | [`AnyTagNode`](modules.md#anytagnode) |

#### Returns

`MagicString`

#### Defined in

[bluehawk/tags/removeMetaRange.ts:25](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/tags/removeMetaRange.ts#L25)

___

### snip

▸ **snip**(`args`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules.md#withactionreporter)\<[`SnipArgs`](interfaces/SnipArgs.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[bluehawk/actions/snip.ts:205](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/snip.ts#L205)

___

### withGenerateFormattedCodeSnippetsOption

▸ **withGenerateFormattedCodeSnippetsOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `generateFormattedCodeSnippets?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `generateFormattedCodeSnippets?`: `string`  }\>

#### Defined in

[bluehawk/options.ts:68](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L68)

___

### withIdOption

▸ **withIdOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `id?`: `string` \| `string`[]  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `id?`: `string` \| `string`[]  }\>

#### Defined in

[bluehawk/options.ts:59](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L59)

___

### withIgnoreOption

▸ **withIgnoreOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `ignore?`: `string` \| `string`[]  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `ignore?`: `string` \| `string`[]  }\>

#### Defined in

[bluehawk/options.ts:28](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L28)

___

### withJsonOption

▸ **withJsonOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `json?`: `boolean`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `json?`: `boolean`  }\>

#### Defined in

[bluehawk/options.ts:82](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L82)

___

### withLogLevelOption

▸ **withLogLevelOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `logLevel?`: `number`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `logLevel?`: `number`  }\>

#### Defined in

[bluehawk/options.ts:92](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L92)

___

### withOutputOption

▸ **withOutputOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `output`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `output`: `string`  }\>

#### Defined in

[bluehawk/options.ts:16](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L16)

___

### withRenameOption

▸ **withRenameOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `rename?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `rename?`: `string`  }\>

#### Defined in

[bluehawk/options.ts:49](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L49)

___

### withStateOption

▸ **withStateOption**\<`T`\>(`yargs`): `Argv`\<`T` & \{ `state?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`\<`T`\> |

#### Returns

`Argv`\<`T` & \{ `state?`: `string`  }\>

#### Defined in

[bluehawk/options.ts:39](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/options.ts#L39)
