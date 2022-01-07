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

[src/bluehawk/parser/visitor/makeCstVisitor.ts:30](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/visitor/makeCstVisitor.ts#L30)

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

[src/bluehawk/parser/visitor/makeCstVisitor.ts:31](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/visitor/makeCstVisitor.ts#L31)
