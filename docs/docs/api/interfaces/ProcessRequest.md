---
id: "ProcessRequest"
title: "Interface: ProcessRequest<CommandNodeType>"
sidebar_label: "ProcessRequest"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `CommandNodeType` | [`AnyCommandNode`](../modules#anycommandnode) |

## Properties

### commandNode

• **commandNode**: `CommandNodeType`

The specific command to process.

#### Defined in

[src/bluehawk/processor/Processor.ts:38](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/processor/Processor.ts#L38)

___

### commandNodes

• **commandNodes**: [`AnyCommandNode`](../modules#anycommandnode)[]

The overall result's command nodes being processed by the processor.

#### Defined in

[src/bluehawk/processor/Processor.ts:43](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/processor/Processor.ts#L43)

___

### document

• **document**: [`Document`](../classes/Document)

The document to be edited by the processor.

Command processors may edit the document text directly using MagicString
functionality. Avoid converting the text to a non-MagicString string, as the
edit history must be retained for subsequent edits and listener processing
to work as expected.

Command processors may safely modify the attributes of the document under
their own command name's key (e.g. a command named "myCommand" may freely
edit `document.attributes["myCommand"]`). Attributes are useful for passing
meta information from the command to an eventual listener.

#### Defined in

[src/bluehawk/processor/Processor.ts:33](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/processor/Processor.ts#L33)

## Methods

### fork

▸ **fork**(`args`): `void`

Process the given Bluehawk result, optionally under an alternative id, and
emit the file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `ForkArgs` |

#### Returns

`void`

#### Defined in

[src/bluehawk/processor/Processor.ts:49](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/processor/Processor.ts#L49)

___

### stopPropagation

▸ **stopPropagation**(): `void`

Call this to stop the processor from continuing into the command node's
children.

#### Returns

`void`

#### Defined in

[src/bluehawk/processor/Processor.ts:55](https://github.com/mongodben/Bluehawk/blob/488980a/src/bluehawk/processor/Processor.ts#L55)
