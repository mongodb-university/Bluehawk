---
id: "ProcessRequest"
title: "Interface: ProcessRequest<TagNodeType>"
sidebar_label: "ProcessRequest"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `TagNodeType` | [`AnyTagNode`](../modules.md#anytagnode) |

## Properties

### document

• **document**: [`Document`](../classes/Document.md)

The document to be edited by the processor.

Tag processors may edit the document text directly using MagicString
functionality. Avoid converting the text to a non-MagicString string, as the
edit history must be retained for subsequent edits and listener processing
to work as expected.

Tag processors may safely modify the attributes of the document under
their own tag name's key (e.g. a tag named "myTag" may freely
edit `document.attributes["myTag"]`). Attributes are useful for passing
meta information from the tag to an eventual listener.

#### Defined in

[bluehawk/processor/Processor.ts:34](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/processor/Processor.ts#L34)

___

### fork

• **fork**: (`args`: `ForkArgs`) => `void`

Process the given Bluehawk result, optionally under an alternative id, and
emit the file.

#### Type declaration

▸ (`args`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `ForkArgs` |

##### Returns

`void`

#### Defined in

[bluehawk/processor/Processor.ts:50](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/processor/Processor.ts#L50)

___

### stopPropagation

• **stopPropagation**: () => `void`

Call this to stop the processor from continuing into the tag node's
children.

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[bluehawk/processor/Processor.ts:56](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/processor/Processor.ts#L56)

___

### tagNode

• **tagNode**: `TagNodeType`

The specific tag to process.

#### Defined in

[bluehawk/processor/Processor.ts:39](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/processor/Processor.ts#L39)

___

### tagNodes

• **tagNodes**: [`AnyTagNode`](../modules.md#anytagnode)[]

The overall result's tag nodes being processed by the processor.

#### Defined in

[bluehawk/processor/Processor.ts:44](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/processor/Processor.ts#L44)
