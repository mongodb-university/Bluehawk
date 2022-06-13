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
- [AnyTag](interfaces/AnyTag)
- [BlockCommentTokenConfiguration](interfaces/BlockCommentTokenConfiguration)
- [BlockTagNode](interfaces/BlockTagNode)
- [CheckArgs](interfaces/CheckArgs)
- [CheckResult](interfaces/CheckResult)
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

### AnyTagNode

Ƭ **AnyTagNode**: [`LineTagNode`](interfaces/LineTagNode) \| [`BlockTagNode`](interfaces/BlockTagNode)

#### Defined in

[src/bluehawk/parser/TagNode.ts:64](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/TagNode.ts#L64)

___

### IdRequiredAttributes

Ƭ **IdRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[src/bluehawk/tags/Tag.ts:85](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L85)

___

### IdsRequiredAttributes

Ƭ **IdsRequiredAttributes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string`[] |

#### Defined in

[src/bluehawk/tags/Tag.ts:101](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L101)

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

[src/bluehawk/processor/Processor.ts:102](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/processor/Processor.ts#L102)

___

### LoadedPlugin

Ƭ **LoadedPlugin**: [`Plugin`](modules#plugin) & { `path`: `string`  }

#### Defined in

[src/bluehawk/Plugin.ts:34](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L34)

___

### NoAttributes

Ƭ **NoAttributes**: ``null``

#### Defined in

[src/bluehawk/tags/Tag.ts:111](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L111)

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

[src/bluehawk/OnBinaryFileFunction.ts:1](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/OnBinaryFileFunction.ts#L1)

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

[src/bluehawk/Plugin.ts:26](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L26)

## Variables

### EmphasizeTag

• **EmphasizeTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/EmphasizeTag.ts:19](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/EmphasizeTag.ts#L19)

___

### IdRequiredAttributesSchema

• **IdRequiredAttributesSchema**: `JSONSchemaType`<[`IdRequiredAttributes`](modules#idrequiredattributes)\>

#### Defined in

[src/bluehawk/tags/Tag.ts:86](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L86)

___

### IdsRequiredAttributesSchema

• **IdsRequiredAttributesSchema**: `JSONSchemaType`<[`IdsRequiredAttributes`](modules#idsrequiredattributes)\>

#### Defined in

[src/bluehawk/tags/Tag.ts:102](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L102)

___

### NoAttributesSchema

• **NoAttributesSchema**: `JSONSchemaType`<[`NoAttributes`](modules#noattributes)\>

#### Defined in

[src/bluehawk/tags/Tag.ts:112](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L112)

___

### RemoveTag

• **RemoveTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/RemoveTag.ts:3](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/RemoveTag.ts#L3)

___

### ReplaceTag

• **ReplaceTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/ReplaceTag.ts:10](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/ReplaceTag.ts#L10)

___

### SnippetTag

• **SnippetTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/SnippetTag.ts:65](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/SnippetTag.ts#L65)

___

### StateTag

• **StateTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/StateTag.ts:9](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/StateTag.ts#L9)

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

[src/bluehawk/io/System.ts:7](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/io/System.ts#L7)

___

### UncommentTag

• **UncommentTag**: [`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/UncommentTag.ts:6](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/UncommentTag.ts#L6)

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

[src/bluehawk/getBluehawk.ts:22](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/getBluehawk.ts#L22)

## Functions

### check

▸ `Const` **check**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `WithActionReporter`<[`CheckArgs`](interfaces/CheckArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/check.ts:15](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/check.ts#L15)

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

[src/bluehawk/Plugin.ts:106](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L106)

___

### copy

▸ `Const` **copy**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `WithActionReporter`<[`CopyArgs`](interfaces/CopyArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/copy.ts:20](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/copy.ts#L20)

___

### createFormattedCodeBlock

▸ `Const` **createFormattedCodeBlock**(`__namedParameters`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.format` | `string` |
| `__namedParameters.output` | `string` |
| `__namedParameters.reporter` | `ActionReporter` |
| `__namedParameters.result` | `ProcessResult` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/snip.ts:20](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/snip.ts#L20)

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

[src/bluehawk/parser/flatten.ts:2](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/flatten.ts#L2)

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

[src/bluehawk/actions/snip.ts:125](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/snip.ts#L125)

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

[src/bluehawk/actions/snip.ts:57](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/snip.ts#L57)

___

### listStates

▸ `Const` **listStates**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `WithActionReporter`<[`ListStatesArgs`](interfaces/ListStatesArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/listStates.ts:12](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/listStates.ts#L12)

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

[src/bluehawk/actions/listTags.ts:9](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/listTags.ts#L9)

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

[src/bluehawk/Plugin.ts:71](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/Plugin.ts#L71)

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

[src/bluehawk/project/loadProjectPaths.ts:56](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/project/loadProjectPaths.ts#L56)

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

[src/bluehawk/parser/lexer/makeBlockCommentTokens.ts:9](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/lexer/makeBlockCommentTokens.ts#L9)

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
| `tag` | `Tag` & { `attributesSchema`: `JSONSchemaType`<`AttributesType`, ``false``\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`AnyTagNode`](modules#anytagnode)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/Tag.ts:67](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L67)

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
| `tag` | `Tag` & { `attributesSchema`: `JSONSchemaType`<`AttributesType`, ``false``\> ; `process`: (`request`: [`ProcessRequest`](interfaces/ProcessRequest)<[`BlockTagNode`](interfaces/BlockTagNode)\>) => `NotPromise`  } |

#### Returns

[`AnyTag`](interfaces/AnyTag)

#### Defined in

[src/bluehawk/tags/Tag.ts:34](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L34)

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

[src/bluehawk/parser/visitor/makeCstVisitor.ts:44](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/visitor/makeCstVisitor.ts#L44)

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

[src/bluehawk/parser/lexer/makeLineCommentToken.ts:4](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/lexer/makeLineCommentToken.ts#L4)

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

[src/bluehawk/tags/Tag.ts:51](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/Tag.ts#L51)

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

[src/bluehawk/parser/makeParser.ts:27](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/makeParser.ts#L27)

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

[src/bluehawk/parser/lexer/makePayloadPattern.ts:20](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/lexer/makePayloadPattern.ts#L20)

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

[src/bluehawk/parser/lexer/makePushParserTokens.ts:19](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/lexer/makePushParserTokens.ts#L19)

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

[src/bluehawk/tags/removeMetaRange.ts:25](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/tags/removeMetaRange.ts#L25)

___

### snip

▸ `Const` **snip**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `WithActionReporter`<[`SnipArgs`](interfaces/SnipArgs)\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/bluehawk/actions/snip.ts:164](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/actions/snip.ts#L164)

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

[src/bluehawk/options.ts:58](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L58)

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

[src/bluehawk/options.ts:49](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L49)

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

[src/bluehawk/options.ts:28](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L28)

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

[src/bluehawk/options.ts:72](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L72)

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

[src/bluehawk/options.ts:82](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L82)

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

[src/bluehawk/options.ts:16](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L16)

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

[src/bluehawk/options.ts:39](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/options.ts#L39)
