---
id: "ActionReporter"
title: "Interface: ActionReporter"
sidebar_label: "ActionReporter"
sidebar_position: 0
custom_edit_url: null
---

Handles various events for user information.

## Implemented by

- [`ConsoleActionReporter`](../classes/ConsoleActionReporter)

## Properties

### errorCount

• `Readonly` **errorCount**: `number`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:14](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L14)

___

### logLevel

• **logLevel**: [`LogLevel`](../enums/LogLevel)

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:13](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L13)

## Methods

### onActionProcessed

▸ **onActionProcessed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ActionProcessedEvent`](../modules#actionprocessedevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:17](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L17)

___

### onBinaryFile

▸ **onBinaryFile**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileEvent`](../modules#fileevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:18](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L18)

___

### onBluehawkErrors

▸ **onBluehawkErrors**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`BluehawkErrorsEvent`](../modules#bluehawkerrorsevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:31](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L31)

___

### onFileError

▸ **onFileError**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileErrorEvent`](../modules#fileerrorevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:29](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L29)

___

### onFileParsed

▸ **onFileParsed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileParsedEvent`](../modules#fileparsedevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:19](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L19)

___

### onFileWritten

▸ **onFileWritten**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileWrittenEvent`](../modules#filewrittenevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:20](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L20)

___

### onIdsUnused

▸ **onIdsUnused**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`IdsUnusedEvent`](../modules#idsunusedevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:25](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L25)

___

### onParserNotFound

▸ **onParserNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ParserNotFoundEvent`](../modules#parsernotfoundevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:26](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L26)

___

### onStateNotFound

▸ **onStateNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StateNotFoundEvent`](../modules#statenotfoundevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:24](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L24)

___

### onStatesFound

▸ **onStatesFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StatesFoundEvent`](../modules#statesfoundevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:21](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L21)

___

### onWriteFailed

▸ **onWriteFailed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`WriteFailedEvent`](../modules#writefailedevent) |

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:30](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L30)

___

### printSummary

▸ **printSummary**(): `void`

Request the summary of all things reported so far.

Users should call this after an action is complete.

#### Returns

`void`

#### Defined in

[src/bluehawk/actions/ActionReporter.ts:38](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ActionReporter.ts#L38)
