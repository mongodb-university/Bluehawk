---
id: "ConsoleActionReporter"
title: "Class: ConsoleActionReporter"
sidebar_label: "ConsoleActionReporter"
sidebar_position: 0
custom_edit_url: null
---

Handles various events for user information.

## Implements

- [`ActionReporter`](../interfaces/ActionReporter.md)

## Constructors

### constructor

• **new ConsoleActionReporter**(`args?`): [`ConsoleActionReporter`](ConsoleActionReporter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | `Object` |
| `args.logLevel?` | [`LogLevel`](../enums/LogLevel.md) |

#### Returns

[`ConsoleActionReporter`](ConsoleActionReporter.md)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:26](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L26)

## Properties

### \_count

• **\_count**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binaryFiles` | `number` |
| `errors` | `number` |
| `filesWritten` | `number` |
| `textFiles` | `number` |

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:17](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L17)

___

### logLevel

• **logLevel**: [`LogLevel`](../enums/LogLevel.md) = `LogLevel.Info`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[logLevel](../interfaces/ActionReporter.md#loglevel)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:24](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L24)

## Accessors

### errorCount

• `get` **errorCount**(): `number`

#### Returns

`number`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[errorCount](../interfaces/ActionReporter.md#errorcount)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:32](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L32)

## Methods

### onBinaryFile

▸ **onBinaryFile**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileEvent`](../modules.md#fileevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onBinaryFile](../interfaces/ActionReporter.md#onbinaryfile)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:36](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L36)

___

### onBluehawkErrors

▸ **onBluehawkErrors**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`BluehawkErrorsEvent`](../modules.md#bluehawkerrorsevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onBluehawkErrors](../interfaces/ActionReporter.md#onbluehawkerrors)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:101](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L101)

___

### onFileError

▸ **onFileError**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileErrorEvent`](../modules.md#fileerrorevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onFileError](../interfaces/ActionReporter.md#onfileerror)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:85](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L85)

___

### onFileParsed

▸ **onFileParsed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileParsedEvent`](../modules.md#fileparsedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onFileParsed](../interfaces/ActionReporter.md#onfileparsed)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:43](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L43)

___

### onFileWritten

▸ **onFileWritten**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileWrittenEvent`](../modules.md#filewrittenevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onFileWritten](../interfaces/ActionReporter.md#onfilewritten)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:50](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L50)

___

### onIdsUnused

▸ **onIdsUnused**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`IdsUnusedEvent`](../modules.md#idsunusedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onIdsUnused](../interfaces/ActionReporter.md#onidsunused)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:71](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L71)

___

### onParserNotFound

▸ **onParserNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ParserNotFoundEvent`](../modules.md#parsernotfoundevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onParserNotFound](../interfaces/ActionReporter.md#onparsernotfound)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:77](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L77)

___

### onStateNotFound

▸ **onStateNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StateNotFoundEvent`](../modules.md#statenotfoundevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onStateNotFound](../interfaces/ActionReporter.md#onstatenotfound)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:65](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L65)

___

### onStatesFound

▸ **onStatesFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StatesFoundEvent`](../modules.md#statesfoundevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onStatesFound](../interfaces/ActionReporter.md#onstatesfound)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:59](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L59)

___

### onWriteFailed

▸ **onWriteFailed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`WriteFailedEvent`](../modules.md#writefailedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[onWriteFailed](../interfaces/ActionReporter.md#onwritefailed)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:92](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L92)

___

### printSummary

▸ **printSummary**(): `void`

Request the summary of all things reported so far.

Users should call this after an action is complete.

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter.md).[printSummary](../interfaces/ActionReporter.md#printsummary)

#### Defined in

[bluehawk/actions/ConsoleActionReporter.ts:115](https://github.com/krollins-mdb/Bluehawk/blob/0886b9526801a2b31a73b01fc05e9bdcbd23c69e/src/bluehawk/actions/ConsoleActionReporter.ts#L115)
