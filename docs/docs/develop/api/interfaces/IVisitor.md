---
id: "IVisitor"
title: "Interface: IVisitor"
sidebar_label: "IVisitor"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### parser

• **parser**: [`RootParser`](../classes/RootParser.md)

#### Defined in

[bluehawk/parser/visitor/makeCstVisitor.ts:26](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/visitor/makeCstVisitor.ts#L26)

## Methods

### visit

▸ **visit**(`node`, `source`): [`VisitorResult`](VisitorResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `CstNode` |
| `source` | [`Document`](../classes/Document.md) |

#### Returns

[`VisitorResult`](VisitorResult.md)

#### Defined in

[bluehawk/parser/visitor/makeCstVisitor.ts:27](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/parser/visitor/makeCstVisitor.ts#L27)
