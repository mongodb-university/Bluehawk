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

## Enumerations

- [LogLevel](enums/LogLevel)

## Classes

- [Bluehawk](classes/Bluehawk)
- [ConsoleActionReporter](classes/ConsoleActionReporter)
- [Document](classes/Document)
- [RootParser](classes/RootParser)

## Interfaces

- [ActionArgs](interfaces/ActionArgs)
- [ActionReporter](interfaces/ActionReporter)
- [AnyTag](interfaces/AnyTag)
- [BlockCommentTokenConfiguration](interfaces/BlockCommentTokenConfiguration)
- [BlockTagNode](interfaces/BlockTagNode)
- [CheckArgs](interfaces/CheckArgs)
- [CheckResult](interfaces/CheckResult)
- [Config](interfaces/Config)
- [ConfigAction](interfaces/ConfigAction)
- [ConfigArgs](interfaces/ConfigArgs)
- [CopyArgs](interfaces/CopyArgs)
- [EmphasizeRange](interfaces/EmphasizeRange)
- [EmphasizeSourceAttributes](interfaces/EmphasizeSourceAttributes)
- [IParser](interfaces/IParser)
- [IVisitor](interfaces/IVisitor)
- [LanguageSpecification](interfaces/LanguageSpecification)
- [LineTagNode](interfaces/LineTagNode)
- [ListStatesArgs](interfaces/ListStatesArgs)
- [ListTagArgs](interfaces/ListTagArgs)
- [ParseResult](interfaces/ParseResult)
- [PayloadQuery](interfaces/PayloadQuery)
- [PluginArgs](interfaces/PluginArgs)
- [ProcessOptions](interfaces/ProcessOptions)
- [ProcessRequest](interfaces/ProcessRequest)
- [Project](interfaces/Project)
- [PushParserPayload](interfaces/PushParserPayload)
- [PushParserTokenConfiguration](interfaces/PushParserTokenConfiguration)
- [SnipArgs](interfaces/SnipArgs)
- [VisitorResult](interfaces/VisitorResult)

## Type aliases

### ActionProcessedEvent

Ƭ **ActionProcessedEvent**: [`FileEvent`](modules#fileevent) & { `name`: `string`  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:52](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L52)

___

### AnyTagNode

Ƭ **AnyTagNode**: [`LineTagNode`](interfaces/LineTagNode) \| [`BlockTagNode`](interfaces/BlockTagNode)

#### Defined in

[src/bluehawk/parser/TagNode.ts:63](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L63)

___

### BinaryFileEvent

Ƭ **BinaryFileEvent**: [`FileEvent`](modules#fileevent)

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:56](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L56)

___

### BluehawkErrorsEvent

Ƭ **BluehawkErrorsEvent**: [`FileEvent`](modules#fileevent) & { `errors`: `BluehawkError`[]  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:96](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L96)

___

### CopyArgsCli

Ƭ **CopyArgsCli**: `Omit`<[`CopyArgs`](interfaces/CopyArgs), ``"rename"``\> & { `rename?`: `string`  }

#### Defined in

[src/bluehawk/actions/copy.ts:22](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L22)

___

### FileErrorEvent

Ƭ **FileErrorEvent**: [`FileEvent`](modules#fileevent) & { `error`: `Error`  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:88](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L88)

___

### FileEvent

Ƭ **FileEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputPath` | `string` |

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:48](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L48)

___

### FileParsedEvent

Ƭ **FileParsedEvent**: [`FileEvent`](modules#fileevent) & { `isConfig?`: `boolean` ; `parseResult?`: [`ParseResult`](interfaces/ParseResult)  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:58](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L58)

___

### FileWrittenEvent

Ƭ **FileWrittenEvent**: [`FileEvent`](modules#fileevent) & { `outputPath`: `string` ; `type`: ``"text"`` \| ``"binary"``  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:63](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L63)

___

### IdRequiredAttributes

Ƭ **IdRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[src/bluehawk/tags/Tag.ts:115](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L115)

___

### IdsRequiredAttributes

Ƭ **IdsRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[src/bluehawk/tags/Tag.ts:131](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L131)

___

### IdsUnusedEvent

Ƭ **IdsUnusedEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ids` | `string`[] |
| `paths` | `string`[] |

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:79](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L79)

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

[src/bluehawk/processor/Processor.ts:102](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/processor/Processor.ts#L102)

___

### LoadedPlugin

Ƭ **LoadedPlugin**: [`Plugin`](modules#plugin) & { `path`: `string`  }

#### Defined in

[src/bluehawk/Plugin.ts:34](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/Plugin.ts#L34)

___

### NoAttributes

Ƭ **NoAttributes**: ``null``

#### Defined in

[src/bluehawk/tags/Tag.ts:141](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L141)

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

[src/bluehawk/OnBinaryFileFunction.ts:1](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/OnBinaryFileFunction.ts#L1)

___

### ParserNotFoundEvent

Ƭ **ParserNotFoundEvent**: [`FileEvent`](modules#fileevent) & { `error`: `Error`  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:84](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L84)

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
| `register` | (`args`: [`PluginArgs`](interfaces/PluginArgs)) => `void` \| `Promise`<`void`\> |

#### Defined in

[src/bluehawk/Plugin.ts:26](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/Plugin.ts#L26)

___

### StateNotFoundEvent

Ƭ **StateNotFoundEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `paths` | `string`[] |
| `state` | `string` |

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:74](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L74)

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

[src/bluehawk/actions/ActionReporter.ts:68](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L68)

___

### WithActionReporter

Ƭ **WithActionReporter**<`T`\>: `T` & { `reporter`: [`ActionReporter`](interfaces/ActionReporter)  }

Creates a type with a required ActionReporter field.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:7](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L7)

___

### WriteFailedEvent

Ƭ **WriteFailedEvent**: [`FileWrittenEvent`](modules#filewrittenevent) & { `error`: `Error`  }

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:92](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L92)

## Variables

### EmphasizeTag

• **EmphasizeTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/EmphasizeTag.ts:19](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/EmphasizeTag.ts#L19)

___

### IdRequiredAttributesSchema

• **IdRequiredAttributesSchema**: `JSONSchemaType`<[`IdRequiredAttributes`](modules#idrequiredattributes)\>

#### Defined in

[src/bluehawk/tags/Tag.ts:116](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L116)

___

### IdsRequiredAttributesSchema

• **IdsRequiredAttributesSchema**: `JSONSchemaType`<[`IdsRequiredAttributes`](modules#idsrequiredattributes)\>

#### Defined in

[src/bluehawk/tags/Tag.ts:132](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L132)

___

### NoAttributesSchema

• **NoAttributesSchema**: `JSONSchemaType`<[`NoAttributes`](modules#noattributes)\>

#### Defined in

[src/bluehawk/tags/Tag.ts:142](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L142)

___

### RENAME\_ERR

• **RENAME\_ERR**: ``"Rename flag does not support specifying a path argument. If you would like to see this functionality, please submit an issue or pull request."``

#### Defined in

[src/bluehawk/actions/copy.ts:24](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L24)

___

### RemoveTag

• **RemoveTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/RemoveTag.ts:3](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/RemoveTag.ts#L3)

___

### ReplaceTag

• **ReplaceTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/ReplaceTag.ts:10](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/ReplaceTag.ts#L10)

___

### SnippetTag

• **SnippetTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/SnippetTag.ts:65](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/SnippetTag.ts#L65)

___

### StateRemoveTag

• **StateRemoveTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/StateRemoveTag.ts:9](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/StateRemoveTag.ts#L9)

___

### StateTag

• **StateTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/StateTag.ts:10](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/StateTag.ts#L10)

___

### System

• **System**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fs` | `__module` |
| `useJsonFs` | (`directoryJson`: `DirectoryJSON`) => `void` |
| `useMemfs` | () => `void` |
| `useRealfs` | () => `void` |

#### Defined in

[src/bluehawk/io/System.ts:7](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/io/System.ts#L7)

___

### UncommentTag

• **UncommentTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/UncommentTag.ts:6](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/UncommentTag.ts#L6)

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

[src/bluehawk/getBluehawk.ts:23](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/getBluehawk.ts#L23)

## Functions

### check

▸ `Const` **check**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules#withactionreporter)<[`CheckArgs`](interfaces/CheckArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/check.ts:15](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/check.ts#L15)

___

### commandDir

▸ **commandDir**<`T`\>(`argv`, `directory`, `options?`): `yargs.Argv`<`T`\>

Loads a directory as yargs commands while supporting TypeScript for development.
See yargs.commandDir().

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `Argv`<`T`\> |
| `directory` | `string` |
| `options?` | `RequireDirectoryOptions` |

#### Returns

`yargs.Argv`<`T`\>

#### Defined in

[src/bluehawk/Plugin.ts:106](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/Plugin.ts#L106)

___

### conditionalForkWithState

▸ `Const` **conditionalForkWithState**(`request`): `void`

If we are not processing in a state file, fork a file for each
state listed in our tag node.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ProcessRequest`](interfaces/ProcessRequest)<[`BlockTagNode`](interfaces/BlockTagNode)\> |

#### Returns

`void`

#### Defined in

[src/bluehawk/tags/StateTag.ts:31](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/StateTag.ts#L31)

___

### copy

▸ `Const` **copy**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules#withactionreporter)<[`CopyArgs`](interfaces/CopyArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/copy.ts:27](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/copy.ts#L27)

___

### createFormattedCodeBlock

▸ `Const` **createFormattedCodeBlock**(`__namedParameters`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.format` | `string` |
| `__namedParameters.output` | `string` |
| `__namedParameters.reporter` | [`ActionReporter`](interfaces/ActionReporter) |
| `__namedParameters.result` | `ProcessResult` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/snip.ts:20](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/snip.ts#L20)

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

[src/bluehawk/parser/flatten.ts:2](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/flatten.ts#L2)

___

### formatInDocusaurus

▸ `Const` **formatInDocusaurus**(`result`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[src/bluehawk/actions/snip.ts:159](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/snip.ts#L159)

___

### formatInMd

▸ `Const` **formatInMd**(`result`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `ProcessResult` |

#### Returns

`undefined` \| `string`

#### Defined in

[src/bluehawk/actions/snip.ts:146](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/snip.ts#L146)

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

[src/bluehawk/actions/snip.ts:75](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/snip.ts#L75)

___

### listStates

▸ `Const` **listStates**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules#withactionreporter)<[`ListStatesArgs`](interfaces/ListStatesArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/listStates.ts:12](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/listStates.ts#L12)

___

### listTags

▸ `Const` **listTags**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ListTagArgs`](interfaces/ListTagArgs) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/listTags.ts:9](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/listTags.ts#L9)

___

### loadPlugins

▸ `Const` **loadPlugins**(`path`): `Promise`<[`LoadedPlugin`](modules#loadedplugin)[]\>

Load the given plugin(s).

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `undefined` \| `string` \| `string`[] |

#### Returns

`Promise`<[`LoadedPlugin`](modules#loadedplugin)[]\>

#### Defined in

[src/bluehawk/Plugin.ts:71](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/Plugin.ts#L71)

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

[src/bluehawk/project/loadProjectPaths.ts:57](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/project/loadProjectPaths.ts#L57)

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

[src/bluehawk/parser/lexer/makeBlockCommentTokens.ts:9](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/lexer/makeBlockCommentTokens.ts#L9)

___

### makeBlockOrLineTag

▸ **makeBlockOrLineTag**<`AttributesType`\>(`tag`): [`AnyTag`](interfaces/AnyTag)

#### Type parameters

| Name |
| :------ |
| `AttributesType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Tag` & { `attributesSchema`: `UncheckedJSONSchemaType`<`AttributesType`, ``false``\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`AnyTagNode`](modules#anytagnode)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/Tag.ts:93](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L93)

___

### makeBlockTag

▸ **makeBlockTag**<`AttributesType`\>(`tag`): [`AnyTag`](interfaces/AnyTag)

#### Type parameters

| Name |
| :------ |
| `AttributesType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Tag` & { `attributesSchema`: `UncheckedJSONSchemaType`<`AttributesType`, ``false``\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`BlockTagNode`](interfaces/BlockTagNode)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/Tag.ts:60](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L60)

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

[src/bluehawk/parser/visitor/makeCstVisitor.ts:44](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/visitor/makeCstVisitor.ts#L44)

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

[src/bluehawk/parser/lexer/makeLineCommentToken.ts:4](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/lexer/makeLineCommentToken.ts#L4)

___

### makeLineTag

▸ **makeLineTag**(`tag`): [`AnyTag`](interfaces/AnyTag)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Tag` & { `attributesSchema?`: `undefined` ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`LineTagNode`](interfaces/LineTagNode)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/Tag.ts:77](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L77)

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

[src/bluehawk/parser/makeParser.ts:29](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/makeParser.ts#L29)

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

[src/bluehawk/parser/lexer/makePayloadPattern.ts:20](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/lexer/makePayloadPattern.ts#L20)

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

[src/bluehawk/parser/lexer/makePushParserTokens.ts:19](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/lexer/makePushParserTokens.ts#L19)

___

### mapShorthandArgsToAttributes

▸ **mapShorthandArgsToAttributes**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.shorthandArgsAttributeName?` | `string` |
| `__namedParameters.tagNode` | [`AnyTagNode`](modules#anytagnode) |

#### Returns

`void`

#### Defined in

[src/bluehawk/tags/Tag.ts:147](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/Tag.ts#L147)

___

### removeMetaRange

▸ **removeMetaRange**(`s`, `tagNode`): `MagicString`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `default` |
| `tagNode` | [`AnyTagNode`](modules#anytagnode) |

#### Returns

`MagicString`

#### Defined in

[src/bluehawk/tags/removeMetaRange.ts:25](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/tags/removeMetaRange.ts#L25)

___

### run

▸ `Const` **run**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules#withactionreporter)<[`ConfigArgs`](interfaces/ConfigArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/run.ts:27](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/run.ts#L27)

___

### snip

▸ `Const` **snip**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`WithActionReporter`](modules#withactionreporter)<[`SnipArgs`](interfaces/SnipArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/snip.ts:197](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/snip.ts#L197)

___

### withConfigOption

▸ **withConfigOption**<`T`\>(`yargs`): `Argv`<`T` & { `configPath?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `configPath?`: `string`  }\>

#### Defined in

[src/bluehawk/options.ts:103](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L103)

___

### withGenerateFormattedCodeSnippetsOption

▸ **withGenerateFormattedCodeSnippetsOption**<`T`\>(`yargs`): `Argv`<`T` & { `generateFormattedCodeSnippets?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `generateFormattedCodeSnippets?`: `string`  }\>

#### Defined in

[src/bluehawk/options.ts:68](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L68)

___

### withIdOption

▸ **withIdOption**<`T`\>(`yargs`): `Argv`<`T` & { `id?`: `string` \| `string`[]  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `id?`: `string` \| `string`[]  }\>

#### Defined in

[src/bluehawk/options.ts:59](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L59)

___

### withIgnoreOption

▸ **withIgnoreOption**<`T`\>(`yargs`): `Argv`<`T` & { `ignore?`: `string` \| `string`[]  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `ignore?`: `string` \| `string`[]  }\>

#### Defined in

[src/bluehawk/options.ts:28](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L28)

___

### withJsonOption

▸ **withJsonOption**<`T`\>(`yargs`): `Argv`<`T` & { `json?`: `boolean`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `json?`: `boolean`  }\>

#### Defined in

[src/bluehawk/options.ts:82](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L82)

___

### withLogLevelOption

▸ **withLogLevelOption**<`T`\>(`yargs`): `Argv`<`T` & { `logLevel?`: `number`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `logLevel?`: `number`  }\>

#### Defined in

[src/bluehawk/options.ts:92](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L92)

___

### withOutputOption

▸ **withOutputOption**<`T`\>(`yargs`): `Argv`<`T` & { `output`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `output`: `string`  }\>

#### Defined in

[src/bluehawk/options.ts:16](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L16)

___

### withRenameOption

▸ **withRenameOption**<`T`\>(`yargs`): `Argv`<`T` & { `rename?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `rename?`: `string`  }\>

#### Defined in

[src/bluehawk/options.ts:49](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L49)

___

### withStateOption

▸ **withStateOption**<`T`\>(`yargs`): `Argv`<`T` & { `state?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `yargs` | `Argv`<`T`\> |

#### Returns

`Argv`<`T` & { `state?`: `string`  }\>

#### Defined in

[src/bluehawk/options.ts:39](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/options.ts#L39)
