---
id: "BlockCommandNode"
title: "Interface: BlockCommandNode"
sidebar_label: "BlockCommandNode"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `CommandNode`

  ↳ **`BlockCommandNode`**

## Properties

### associatedTokens

• **associatedTokens**: `IToken`[]

#### Inherited from

CommandNode.associatedTokens

#### Defined in

[src/bluehawk/parser/CommandNode.ts:26](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L26)

___

### attributes

• **attributes**: `CommandNodeAttributes`

#### Overrides

CommandNode.attributes

#### Defined in

[src/bluehawk/parser/CommandNode.ts:61](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L61)

___

### children

• **children**: [`AnyCommandNode`](../modules#anycommandnode)[]

#### Overrides

CommandNode.children

#### Defined in

[src/bluehawk/parser/CommandNode.ts:60](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L60)

___

### commandName

• **commandName**: `string`

#### Inherited from

CommandNode.commandName

#### Defined in

[src/bluehawk/parser/CommandNode.ts:10](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L10)

___

### contentRange

• **contentRange**: `Range`

#### Overrides

CommandNode.contentRange

#### Defined in

[src/bluehawk/parser/CommandNode.ts:59](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L59)

___

### id

• `Optional` **id**: `string`[]

#### Inherited from

CommandNode.id

#### Defined in

[src/bluehawk/parser/CommandNode.ts:33](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L33)

___

### inContext

• **inContext**: `CommandNodeContext`

#### Inherited from

CommandNode.inContext

#### Defined in

[src/bluehawk/parser/CommandNode.ts:29](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L29)

___

### lineComments

• **lineComments**: `IToken`[]

#### Inherited from

CommandNode.lineComments

#### Defined in

[src/bluehawk/parser/CommandNode.ts:23](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L23)

___

### lineRange

• **lineRange**: `Range`

#### Inherited from

CommandNode.lineRange

#### Defined in

[src/bluehawk/parser/CommandNode.ts:19](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L19)

___

### newlines

• **newlines**: `IToken`[]

#### Inherited from

CommandNode.newlines

#### Defined in

[src/bluehawk/parser/CommandNode.ts:22](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L22)

___

### range

• **range**: `Range`

#### Inherited from

CommandNode.range

#### Defined in

[src/bluehawk/parser/CommandNode.ts:15](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L15)

___

### type

• **type**: ``"block"``

#### Overrides

CommandNode.type

#### Defined in

[src/bluehawk/parser/CommandNode.ts:58](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/parser/CommandNode.ts#L58)
