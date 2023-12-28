---
id: "BlockTagNode"
title: "Interface: BlockTagNode"
sidebar_label: "BlockTagNode"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `TagNode`

  ↳ **`BlockTagNode`**

## Properties

### associatedTokens

• **associatedTokens**: `IToken`[]

#### Inherited from

TagNode.associatedTokens

#### Defined in

[src/bluehawk/parser/TagNode.ts:26](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L26)

___

### attributes

• **attributes**: `TagNodeAttributes`

#### Overrides

TagNode.attributes

#### Defined in

[src/bluehawk/parser/TagNode.ts:60](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L60)

___

### children

• **children**: [`AnyTagNode`](../modules#anytagnode)[]

#### Overrides

TagNode.children

#### Defined in

[src/bluehawk/parser/TagNode.ts:59](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L59)

___

### contentRange

• **contentRange**: `Range`

#### Overrides

TagNode.contentRange

#### Defined in

[src/bluehawk/parser/TagNode.ts:58](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L58)

___

### inContext

• **inContext**: `TagNodeContext`

#### Inherited from

TagNode.inContext

#### Defined in

[src/bluehawk/parser/TagNode.ts:29](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L29)

___

### lineComments

• **lineComments**: `IToken`[]

#### Inherited from

TagNode.lineComments

#### Defined in

[src/bluehawk/parser/TagNode.ts:23](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L23)

___

### lineRange

• **lineRange**: `Range`

#### Inherited from

TagNode.lineRange

#### Defined in

[src/bluehawk/parser/TagNode.ts:19](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L19)

___

### newlines

• **newlines**: `IToken`[]

#### Inherited from

TagNode.newlines

#### Defined in

[src/bluehawk/parser/TagNode.ts:22](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L22)

___

### range

• **range**: `Range`

#### Inherited from

TagNode.range

#### Defined in

[src/bluehawk/parser/TagNode.ts:15](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L15)

___

### shorthandArgs

• `Optional` **shorthandArgs**: `string`[]

#### Inherited from

TagNode.shorthandArgs

#### Defined in

[src/bluehawk/parser/TagNode.ts:42](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L42)

___

### tagName

• **tagName**: `string`

#### Inherited from

TagNode.tagName

#### Defined in

[src/bluehawk/parser/TagNode.ts:10](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L10)

___

### type

• **type**: ``"block"``

#### Overrides

TagNode.type

#### Defined in

[src/bluehawk/parser/TagNode.ts:57](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/TagNode.ts#L57)
