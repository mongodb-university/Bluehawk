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

[bluehawk/parser/visitor/makeCstVisitor.ts:26](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/parser/visitor/makeCstVisitor.ts#L26)

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

[bluehawk/parser/visitor/makeCstVisitor.ts:27](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/parser/visitor/makeCstVisitor.ts#L27)
