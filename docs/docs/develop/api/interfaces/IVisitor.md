---
id: "IVisitor"
title: "Interface: IVisitor"
sidebar_label: "IVisitor"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### parser

• **parser**: [`RootParser`](../classes/RootParser)

#### Defined in

[src/bluehawk/parser/visitor/makeCstVisitor.ts:26](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/visitor/makeCstVisitor.ts#L26)

## Methods

### visit

▸ **visit**(`node`, `source`): [`VisitorResult`](VisitorResult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `CstNode` |
| `source` | [`Document`](../classes/Document) |

#### Returns

[`VisitorResult`](VisitorResult)

#### Defined in

[src/bluehawk/parser/visitor/makeCstVisitor.ts:27](https://github.com/mongodben/Bluehawk/blob/be77c09/src/bluehawk/parser/visitor/makeCstVisitor.ts#L27)
