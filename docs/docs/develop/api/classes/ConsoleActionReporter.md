---
id: "ConsoleActionReporter"
title: "Class: ConsoleActionReporter"
sidebar_label: "ConsoleActionReporter"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- [`ActionReporter`](../interfaces/ActionReporter)

## Constructors

### constructor

• **new ConsoleActionReporter**(`args?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | `Object` |
| `args.logLevel?` | [`LogLevel`](../enums/LogLevel) |

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:37](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L37)

## Properties

### \_count

• **\_count**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `actions` | `number` |
| `binaryFiles` | `number` |
| `errors` | `number` |
| `filesWritten` | `number` |
| `textFiles` | `number` |

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:27](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L27)

___

### logLevel

• **logLevel**: [`LogLevel`](../enums/LogLevel) = `LogLevel.Info`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[logLevel](../interfaces/ActionReporter#loglevel)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:35](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L35)

## Accessors

### errorCount

• `get` **errorCount**(): `number`

#### Returns

`number`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[errorCount](../interfaces/ActionReporter#errorcount)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:43](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L43)

## Methods

### onActionProcessed

▸ **onActionProcessed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ActionProcessedEvent`](../modules#actionprocessedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onActionProcessed](../interfaces/ActionReporter#onactionprocessed)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:165](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L165)

___

### onBinaryFile

▸ **onBinaryFile**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileEvent`](../modules#fileevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onBinaryFile](../interfaces/ActionReporter#onbinaryfile)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:47](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L47)

___

### onBluehawkErrors

▸ **onBluehawkErrors**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`BluehawkErrorsEvent`](../modules#bluehawkerrorsevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onBluehawkErrors](../interfaces/ActionReporter#onbluehawkerrors)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:146](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L146)

___

### onFileError

▸ **onFileError**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileErrorEvent`](../modules#fileerrorevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onFileError](../interfaces/ActionReporter#onfileerror)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:117](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L117)

___

### onFileParsed

▸ **onFileParsed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileParsedEvent`](../modules#fileparsedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onFileParsed](../interfaces/ActionReporter#onfileparsed)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:59](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L59)

___

### onFileWritten

▸ **onFileWritten**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`FileWrittenEvent`](../modules#filewrittenevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onFileWritten](../interfaces/ActionReporter#onfilewritten)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:77](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L77)

___

### onIdsUnused

▸ **onIdsUnused**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`IdsUnusedEvent`](../modules#idsunusedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onIdsUnused](../interfaces/ActionReporter#onidsunused)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:100](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L100)

___

### onParserNotFound

▸ **onParserNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ParserNotFoundEvent`](../modules#parsernotfoundevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onParserNotFound](../interfaces/ActionReporter#onparsernotfound)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:106](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L106)

___

### onStateNotFound

▸ **onStateNotFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StateNotFoundEvent`](../modules#statenotfoundevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onStateNotFound](../interfaces/ActionReporter#onstatenotfound)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:94](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L94)

___

### onStatesFound

▸ **onStatesFound**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`StatesFoundEvent`](../modules#statesfoundevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onStatesFound](../interfaces/ActionReporter#onstatesfound)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:88](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L88)

___

### onWriteFailed

▸ **onWriteFailed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`WriteFailedEvent`](../modules#writefailedevent) |

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[onWriteFailed](../interfaces/ActionReporter#onwritefailed)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:130](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L130)

___

### printSummary

▸ **printSummary**(): `void`

Request the summary of all things reported so far.

Users should call this after an action is complete.

#### Returns

`void`

#### Implementation of

[ActionReporter](../interfaces/ActionReporter).[printSummary](../interfaces/ActionReporter#printsummary)

#### Defined in

[src/bluehawk/actions/ConsoleActionReporter.ts:175](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/actions/ConsoleActionReporter.ts#L175)
