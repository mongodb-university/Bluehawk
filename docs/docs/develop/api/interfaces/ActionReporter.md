---
id: "ActionReporter"
title: "Interface: ActionReporter"
sidebar_label: "ActionReporter"
sidebar_position: 0
custom_edit_url: null
---

Handles various events for user information.

## Implemented by

- [`ConsoleActionReporter`](../classes/ConsoleActionReporter.md)

## Properties

### errorCount

• `Readonly` **errorCount**: `number`

#### Defined in

[bluehawk/actions/ActionReporter.ts:14](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L14)

___

### logLevel

• **logLevel**: [`LogLevel`](../enums/LogLevel.md)

#### Defined in

[bluehawk/actions/ActionReporter.ts:13](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L13)

## Methods

### onBinaryFile

▸ **onBinaryFile**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileEvent`](../modules.md#fileevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:17](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L17)

___

### onBluehawkErrors

▸ **onBluehawkErrors**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`BluehawkErrorsEvent`](../modules.md#bluehawkerrorsevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:30](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L30)

___

### onFileError

▸ **onFileError**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileErrorEvent`](../modules.md#fileerrorevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:28](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L28)

___

### onFileParsed

▸ **onFileParsed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileParsedEvent`](../modules.md#fileparsedevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:18](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L18)

___

### onFileWritten

▸ **onFileWritten**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileWrittenEvent`](../modules.md#filewrittenevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:19](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L19)

___

### onIdsUnused

▸ **onIdsUnused**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`IdsUnusedEvent`](../modules.md#idsunusedevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:24](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L24)

___

### onParserNotFound

▸ **onParserNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ParserNotFoundEvent`](../modules.md#parsernotfoundevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:25](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L25)

___

### onStateNotFound

▸ **onStateNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StateNotFoundEvent`](../modules.md#statenotfoundevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:23](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L23)

___

### onStatesFound

▸ **onStatesFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StatesFoundEvent`](../modules.md#statesfoundevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:20](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L20)

___

### onWriteFailed

▸ **onWriteFailed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`WriteFailedEvent`](../modules.md#writefailedevent) |

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:29](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L29)

___

### printSummary

▸ **printSummary**(): `void`

Request the summary of all things reported so far.

Users should call this after an action is complete.

#### Returns

`void`

#### Defined in

[bluehawk/actions/ActionReporter.ts:37](https://github.com/krollins-mdb/Bluehawk/blob/d923c41019cdc6c2363277c64633a01b869a67e4/src/bluehawk/actions/ActionReporter.ts#L37)
