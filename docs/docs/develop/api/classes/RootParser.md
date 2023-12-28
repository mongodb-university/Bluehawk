---
id: "RootParser"
title: "Class: RootParser"
sidebar_label: "RootParser"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `CstParser`

  ↳ **`RootParser`**

## Constructors

### constructor

• **new RootParser**(`languageTokens`, `languageSpecification?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageTokens` | `TokenType`[] |
| `languageSpecification?` | [`LanguageSpecification`](../interfaces/LanguageSpecification) |

#### Overrides

CstParser.constructor

#### Defined in

[src/bluehawk/parser/RootParser.ts:103](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L103)

## Properties

### RECORDING\_PHASE

• **RECORDING\_PHASE**: `boolean`

Flag indicating the Parser is at the recording phase.
Can be used to implement methods similar to {@link BaseParser.ACTION}
Or any other logic to requires knowledge of the recording phase.
See:
  - https://chevrotain.io/docs/guide/internals.html#grammar-recording
to learn more on the recording phase and how Chevrotain works.

#### Inherited from

CstParser.RECORDING\_PHASE

#### Defined in

node_modules/@chevrotain/types/api.d.ts:40

___

### \_bluehawkErrors

• `Private` **\_bluehawkErrors**: `BluehawkError`[] = `[]`

#### Defined in

[src/bluehawk/parser/RootParser.ts:325](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L325)

___

### annotatedText

• **annotatedText**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:91](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L91)

___

### attributeList

• **attributeList**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:99](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L99)

___

### blockComment

• **blockComment**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:97](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L97)

___

### blockTag

• **blockTag**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:93](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L93)

___

### blockTagUncommentedContents

• **blockTagUncommentedContents**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:94](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L94)

___

### chunk

• **chunk**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:92](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L92)

___

### errors

• **errors**: `IRecognitionException`[]

#### Inherited from

CstParser.errors

#### Defined in

node_modules/@chevrotain/types/api.d.ts:30

___

### input

• **input**: `IToken`[]

#### Inherited from

CstParser.input

#### Defined in

node_modules/@chevrotain/types/api.d.ts:857

___

### languageSpecification

• `Optional` **languageSpecification**: [`LanguageSpecification`](../interfaces/LanguageSpecification)

#### Defined in

[src/bluehawk/parser/RootParser.ts:101](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L101)

___

### lexer

• **lexer**: `Lexer`

#### Defined in

[src/bluehawk/parser/RootParser.ts:89](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L89)

___

### lineComment

• **lineComment**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:98](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L98)

___

### pushParser

• **pushParser**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:100](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L100)

___

### tag

• **tag**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:95](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L95)

___

### tagAttribute

• **tagAttribute**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:96](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L96)

## Methods

### ACTION

▸ `Protected` **ACTION**<`T`\>(`impl`): `T`

The Semantic Actions wrapper.
Should be used to wrap semantic actions that either:
- May fail when executing in "recording phase".
- Have global side effects that should be avoided during "recording phase".

For more information see:
  - https://chevrotain.io/docs/guide/internals.html#grammar-recording

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `impl` | () => `T` |

#### Returns

`T`

#### Inherited from

CstParser.ACTION

#### Defined in

node_modules/@chevrotain/types/api.d.ts:89

___

### AT\_LEAST\_ONE

▸ `Protected` **AT_LEAST_ONE**(`actionORMethodDef`): `void`

Convenience method, same as MANY but the repetition is of one or more.
failing to match at least one repetition will result in a parsing error and
cause a parsing error.

**`see`** MANY

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actionORMethodDef` | `GrammarAction`<`any`\> \| `DSLMethodOptsWithErr`<`any`\> | The grammar action to optionally invoke multiple times                             or an "OPTIONS" object describing the grammar action and optional properties. |

#### Returns

`void`

#### Inherited from

CstParser.AT\_LEAST\_ONE

#### Defined in

node_modules/@chevrotain/types/api.d.ts:683

___

### AT\_LEAST\_ONE\_SEP

▸ `Protected` **AT_LEAST_ONE_SEP**(`options`): `void`

Convenience method, same as MANY_SEP but the repetition is of one or more.
failing to match at least one repetition will result in a parsing error and
cause the parser to attempt error recovery.

Note that an additional optional property ERR_MSG can be used to provide custom error messages.

**`see`** MANY_SEP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `AtLeastOneSepMethodOpts`<`any`\> | An object defining the grammar of each iteration and the separator between iterations |

#### Returns

`void`

#### Inherited from

CstParser.AT\_LEAST\_ONE\_SEP

#### Defined in

node_modules/@chevrotain/types/api.d.ts:772

___

### BACKTRACK

▸ `Protected` **BACKTRACK**<`T`\>(`grammarRule`, `args?`): () => `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grammarRule` | (...`args`: `any`[]) => `T` | The rule to try and parse in backtracking mode. |
| `args?` | `any`[] | argument to be passed to the grammar rule execution |

#### Returns

`fn`

a lookahead function that will try to parse the given grammarRule and will return true if succeed.

▸ (): `boolean`

##### Returns

`boolean`

a lookahead function that will try to parse the given grammarRule and will return true if succeed.

#### Inherited from

CstParser.BACKTRACK

#### Defined in

node_modules/@chevrotain/types/api.d.ts:75

___

### CONSUME

▸ `Protected` **CONSUME**(`tokType`, `options?`): `IToken`

A Parsing DSL method use to consume a single Token.
In EBNF terms this is equivalent to a Terminal.

A Token will be consumed, IFF the next token in the token vector matches `tokType`.
otherwise the parser may attempt to perform error recovery (if enabled).

The index in the method name indicates the unique occurrence of a terminal consumption
inside a the top level rule. What this means is that if a terminal appears
more than once in a single rule, each appearance must have a **different** index.

For example:
```
  this.RULE("qualifiedName", () => {
  this.CONSUME1(Identifier);
    this.MANY(() => {
      this.CONSUME1(Dot);
      // here we use CONSUME2 because the terminal
      // 'Identifier' has already appeared previously in the
      // the rule 'parseQualifiedName'
      this.CONSUME2(Identifier);
    });
  })
```

- See more details on the [unique suffixes requirement](http://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokType` | `TokenType` | The Type of the token to be consumed. |
| `options?` | `ConsumeMethodOpts` | optional properties to modify the behavior of CONSUME. |

#### Returns

`IToken`

#### Inherited from

CstParser.CONSUME

#### Defined in

node_modules/@chevrotain/types/api.d.ts:186

___

### LA

▸ `Protected` **LA**(`howMuch`): `IToken`

Look-Ahead for the Token Vector
LA(1) is the next Token ahead.
LA(n) is the nth Token ahead.
LA(0) is the previously consumed Token.

Looking beyond the end of the Token Vector or before its begining
will return in an IToken of type EOF {@link EOF}.
This behavior can be used to avoid infinite loops.

This is often used to implement custom lookahead logic for GATES.
https://chevrotain.io/docs/features/gates.html

#### Parameters

| Name | Type |
| :------ | :------ |
| `howMuch` | `number` |

#### Returns

`IToken`

#### Inherited from

CstParser.LA

#### Defined in

node_modules/@chevrotain/types/api.d.ts:878

___

### MANY

▸ `Protected` **MANY**(`actionORMethodDef`): `void`

Parsing DSL method, that indicates a repetition of zero or more.
This is equivalent to EBNF repetition \{...\}.

Note that there are two syntax forms:
- Passing the grammar action directly:
  ```
    this.MANY(() => {
      this.CONSUME(Comma)
      this.CONSUME(Digit)
     })
  ```

- using an "options" object:
  ```
    this.MANY({
      GATE: predicateFunc,
      DEF: () => {
             this.CONSUME(Comma)
             this.CONSUME(Digit)
           }
    });
  ```

The optional 'GATE' property in "options" object form can be used to add constraints
to invoking the grammar action.

As in CONSUME the index in the method name indicates the occurrence
of the repetition production in it's top rule.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actionORMethodDef` | `GrammarAction`<`any`\> \| `DSLMethodOpts`<`any`\> | The grammar action to optionally invoke multiple times                             or an "OPTIONS" object describing the grammar action and optional properties. |

#### Returns

`void`

#### Inherited from

CstParser.MANY

#### Defined in

node_modules/@chevrotain/types/api.d.ts:511

___

### MANY\_SEP

▸ `Protected` **MANY_SEP**(`options`): `void`

Parsing DSL method, that indicates a repetition of zero or more with a separator
Token between the repetitions.

Example:

```
    this.MANY_SEP({
        SEP:Comma,
        DEF: () => {
            this.CONSUME(Number};
            // ...
        })
```

Note that because this DSL method always requires more than one argument the options object is always required
and it is not possible to use a shorter form like in the MANY DSL method.

Note that for the purposes of deciding on whether or not another iteration exists
Only a single Token is examined (The separator). Therefore if the grammar being implemented is
so "crazy" to require multiple tokens to identify an item separator please use the more basic DSL methods
to implement it.

As in CONSUME the index in the method name indicates the occurrence
of the repetition production in it's top rule.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `ManySepMethodOpts`<`any`\> | An object defining the grammar of each iteration and the separator between iterations |

#### Returns

`void`

#### Inherited from

CstParser.MANY\_SEP

#### Defined in

node_modules/@chevrotain/types/api.d.ts:616

___

### OPTION

▸ `Protected` **OPTION**<`OUT`\>(`actionORMethodDef`): `undefined` \| `OUT`

Parsing DSL Method that Indicates an Optional production.
in EBNF notation this is equivalent to: "[...]".

Note that there are two syntax forms:
- Passing the grammar action directly:
  ```
    this.OPTION(() => {
      this.CONSUME(Digit)}
    );
  ```

- using an "options" object:
  ```
    this.OPTION({
      GATE:predicateFunc,
      DEF: () => {
        this.CONSUME(Digit)
    }});
  ```

The optional 'GATE' property in "options" object form can be used to add constraints
to invoking the grammar action.

As in CONSUME the index in the method name indicates the occurrence
of the optional production in it's top rule.

#### Type parameters

| Name |
| :------ |
| `OUT` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actionORMethodDef` | `GrammarAction`<`OUT`\> \| `DSLMethodOpts`<`OUT`\> | The grammar action to optionally invoke once                             or an "OPTIONS" object describing the grammar action and optional properties. |

#### Returns

`undefined` \| `OUT`

The `GrammarAction` return value (OUT) if the optional syntax is encountered
         or `undefined` if not.

#### Inherited from

CstParser.OPTION

#### Defined in

node_modules/@chevrotain/types/api.d.ts:275

___

### OR

▸ `Protected` **OR**<`T`\>(`altsOrOpts`): `T`

Parsing DSL method that indicates a choice between a set of alternatives must be made.
This is equivalent to an EBNF alternation (A | B | C | D ...), except
that the alternatives are ordered like in a PEG grammar.
This means that the **first** matching alternative is always chosen.

There are several forms for the inner alternatives array:

- Passing alternatives array directly:
  ```
    this.OR([
      { ALT:() => { this.CONSUME(One) }},
      { ALT:() => { this.CONSUME(Two) }},
      { ALT:() => { this.CONSUME(Three) }}
    ])
  ```

- Passing alternative array directly with predicates (GATE):
  ```
    this.OR([
      { GATE: predicateFunc1, ALT:() => { this.CONSUME(One) }},
      { GATE: predicateFuncX, ALT:() => { this.CONSUME(Two) }},
      { GATE: predicateFuncX, ALT:() => { this.CONSUME(Three) }}
    ])
  ```

- These syntax forms can also be mixed:
  ```
    this.OR([
      {
        GATE: predicateFunc1,
        ALT:() => { this.CONSUME(One) }
      },
      { ALT:() => { this.CONSUME(Two) }},
      { ALT:() => { this.CONSUME(Three) }}
    ])
  ```

- Additionally an "options" object may be used:
  ```
    this.OR({
      DEF:[
        { ALT:() => { this.CONSUME(One) }},
        { ALT:() => { this.CONSUME(Two) }},
        { ALT:() => { this.CONSUME(Three) }}
      ],
      // OPTIONAL property
      ERR_MSG: "A Number"
    })
  ```

The 'predicateFuncX' in the long form can be used to add constraints to choosing the alternative.

As in CONSUME the index in the method name indicates the occurrence
of the alternation production in it's top rule.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`T`\>[] \| `OrMethodOpts`<`T`\> | A set of alternatives or an "OPTIONS" object describing the alternatives and optional properties. |

#### Returns

`T`

The result of invoking the chosen alternative.

#### Inherited from

CstParser.OR

#### Defined in

node_modules/@chevrotain/types/api.d.ts:411

▸ `Protected` **OR**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR

#### Defined in

node_modules/@chevrotain/types/api.d.ts:412

___

### OR1

▸ `Protected` **OR1**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR1

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:419

___

### OR2

▸ `Protected` **OR2**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR2

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:426

___

### OR3

▸ `Protected` **OR3**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR3

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:433

___

### OR4

▸ `Protected` **OR4**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR4

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:440

___

### OR5

▸ `Protected` **OR5**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR5

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:447

___

### OR6

▸ `Protected` **OR6**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR6

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:454

___

### OR7

▸ `Protected` **OR7**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR7

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:461

___

### OR8

▸ `Protected` **OR8**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR8

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:468

___

### OR9

▸ `Protected` **OR9**(`altsOrOpts`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.OR9

#### Defined in

docs/node_modules/@chevrotain/types/api.d.ts:475

___

### OVERRIDE\_RULE

▸ `Protected` **OVERRIDE_RULE**<`F`\>(`name`, `implementation`, `config?`): `ParserMethod`<`Parameters`<`F`\>, `CstNode`\>

Overrides a Grammar Rule
See usage example in: https://github.com/chevrotain/chevrotain/blob/master/examples/parser/versioning/versioning.js

#### Type parameters

| Name | Type |
| :------ | :------ |
| `F` | extends () => `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `implementation` | `F` |
| `config?` | `IRuleConfig`<`CstNode`\> |

#### Returns

`ParserMethod`<`Parameters`<`F`\>, `CstNode`\>

#### Inherited from

CstParser.OVERRIDE\_RULE

#### Defined in

node_modules/@chevrotain/types/api.d.ts:905

___

### RULE

▸ `Protected` **RULE**<`F`\>(`name`, `implementation`, `config?`): `ParserMethod`<`Parameters`<`F`\>, `CstNode`\>

Creates a Grammar Rule

Note that any parameters of your implementation must be optional as it will
be called without parameters during the grammar recording phase.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `F` | extends () => `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `implementation` | `F` |
| `config?` | `IRuleConfig`<`CstNode`\> |

#### Returns

`ParserMethod`<`Parameters`<`F`\>, `CstNode`\>

#### Inherited from

CstParser.RULE

#### Defined in

node_modules/@chevrotain/types/api.d.ts:895

___

### SKIP\_TOKEN

▸ `Protected` **SKIP_TOKEN**(): `IToken`

Will consume a single token and return the **next** token, meaning
the token **after** the skipped token.

#### Returns

`IToken`

#### Inherited from

CstParser.SKIP\_TOKEN

#### Defined in

node_modules/@chevrotain/types/api.d.ts:863

___

### SUBRULE

▸ `Protected` **SUBRULE**<`ARGS`\>(`ruleToCall`, `options?`): `CstNode`

The Parsing DSL Method is used by one rule to call another.
It is equivalent to a non-Terminal in EBNF notation.

This may seem redundant as it does not actually do much.
However using it is **mandatory** for all sub rule invocations.

Calling another rule without wrapping in SUBRULE(...)
will cause errors/mistakes in the Parser's self analysis phase,
which will lead to errors in error recovery/automatic lookahead calculation
and any other functionality relying on the Parser's self analysis
output.

As in CONSUME the index in the method name indicates the occurrence
of the sub rule invocation in its rule.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ARGS` | extends `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ruleToCall` | `ParserMethod`<`ARGS`, `CstNode`\> |
| `options?` | `SubruleMethodOpts`<`ARGS`\> |

#### Returns

`CstNode`

#### Inherited from

CstParser.SUBRULE

#### Defined in

node_modules/@chevrotain/types/api.d.ts:942

___

### atLeastOne

▸ `Protected` **atLeastOne**(`idx`, `actionORMethodDef`): `void`

Like `AT_LEAST_ONE` with the numerical suffix as a parameter, e.g:
atLeastOne(0, X) === AT_LEAST_ONE(X)
atLeastOne(1, X) === AT_LEAST_ONE1(X)
atLeastOne(2, X) === AT_LEAST_ONE2(X)
...

**`see`** AT_LEAST_ONE

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `actionORMethodDef` | `GrammarAction`<`any`\> \| `DSLMethodOptsWithErr`<`any`\> |

#### Returns

`void`

#### Inherited from

CstParser.atLeastOne

#### Defined in

node_modules/@chevrotain/types/api.d.ts:150

___

### canTokenTypeBeDeletedInRecovery

▸ `Protected` **canTokenTypeBeDeletedInRecovery**(`tokType`): `boolean`

By default, all token types may be deleted. This behavior may be overridden in inheriting parsers.
The method receives the expected token type. The token that would be deleted can be received with [LA](RootParser#la).

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokType` | `TokenType` |

#### Returns

`boolean`

#### Inherited from

CstParser.canTokenTypeBeDeletedInRecovery

#### Defined in

node_modules/@chevrotain/types/api.d.ts:848

___

### canTokenTypeBeInsertedInRecovery

▸ `Protected` **canTokenTypeBeInsertedInRecovery**(`tokType`): `boolean`

By default, all tokens type may be inserted. This behavior may be overridden in inheriting Recognizers
for example: One may decide that only punctuation tokens may be inserted automatically as they have no additional
semantic value. (A mandatory semicolon has no additional semantic meaning, but an Integer may have additional meaning
depending on its int value and context (Inserting an integer 0 in cardinality: "[1..]" will cause semantic issues
as the max of the cardinality will be greater than the min value (and this is a false error!).

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokType` | `TokenType` |

#### Returns

`boolean`

#### Inherited from

CstParser.canTokenTypeBeInsertedInRecovery

#### Defined in

node_modules/@chevrotain/types/api.d.ts:842

___

### computeContentAssist

▸ **computeContentAssist**(`startRuleName`, `precedingInput`): `ISyntacticContentAssistPath`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startRuleName` | `string` |  |
| `precedingInput` | `IToken`[] | The token vector up to (not including) the content assist point |

#### Returns

`ISyntacticContentAssistPath`[]

#### Inherited from

CstParser.computeContentAssist

#### Defined in

node_modules/@chevrotain/types/api.d.ts:64

___

### consume

▸ `Protected` **consume**(`idx`, `tokType`, `options?`): `IToken`

Like `CONSUME` with the numerical suffix as a parameter, e.g:
consume(0, X) === CONSUME(X)
consume(1, X) === CONSUME1(X)
consume(2, X) === CONSUME2(X)
...

**`see`** CONSUME

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `tokType` | `TokenType` |
| `options?` | `ConsumeMethodOpts` |

#### Returns

`IToken`

#### Inherited from

CstParser.consume

#### Defined in

node_modules/@chevrotain/types/api.d.ts:99

___

### getBaseCstVisitorConstructor

▸ **getBaseCstVisitorConstructor**<`IN`, `OUT`\>(): (...`args`: `any`[]) => `ICstVisitor`<`IN`, `OUT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `IN` | `any` |
| `OUT` | `any` |

#### Returns

`fn`

• **new getBaseCstVisitorConstructor**(...`args`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

CstParser.getBaseCstVisitorConstructor

#### Defined in

node_modules/@chevrotain/types/api.d.ts:48

___

### getBaseCstVisitorConstructorWithDefaults

▸ **getBaseCstVisitorConstructorWithDefaults**<`IN`, `OUT`\>(): (...`args`: `any`[]) => `ICstVisitor`<`IN`, `OUT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `IN` | `any` |
| `OUT` | `any` |

#### Returns

`fn`

• **new getBaseCstVisitorConstructorWithDefaults**(...`args`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

CstParser.getBaseCstVisitorConstructorWithDefaults

#### Defined in

node_modules/@chevrotain/types/api.d.ts:52

___

### getGAstProductions

▸ **getGAstProductions**(): `Record`<`string`, `Rule`\>

#### Returns

`Record`<`string`, `Rule`\>

#### Inherited from

CstParser.getGAstProductions

#### Defined in

node_modules/@chevrotain/types/api.d.ts:56

___

### getNextPossibleTokenTypes

▸ `Protected` **getNextPossibleTokenTypes**(`grammarPath`): `TokenType`[]

**`deprecated`** - will be removed in the future

#### Parameters

| Name | Type |
| :------ | :------ |
| `grammarPath` | `ITokenGrammarPath` |

#### Returns

`TokenType`[]

#### Inherited from

CstParser.getNextPossibleTokenTypes

#### Defined in

node_modules/@chevrotain/types/api.d.ts:853

___

### getSerializedGastProductions

▸ **getSerializedGastProductions**(): `ISerializedGast`[]

#### Returns

`ISerializedGast`[]

#### Inherited from

CstParser.getSerializedGastProductions

#### Defined in

node_modules/@chevrotain/types/api.d.ts:58

___

### getTokenToInsert

▸ `Protected` **getTokenToInsert**(`tokType`): `IToken`

Returns an "imaginary" Token to insert when Single Token Insertion is done
Override this if you require special behavior in your grammar.
For example if an IntegerToken is required provide one with the image '0' so it would be valid syntactically.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokType` | `TokenType` |

#### Returns

`IToken`

#### Inherited from

CstParser.getTokenToInsert

#### Defined in

node_modules/@chevrotain/types/api.d.ts:833

___

### many

▸ `Protected` **many**(`idx`, `actionORMethodDef`): `void`

Like `MANY` with the numerical suffix as a parameter, e.g:
many(0, X) === MANY(X)
many(1, X) === MANY1(X)
many(2, X) === MANY2(X)
...

**`see`** MANY

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `actionORMethodDef` | `GrammarAction`<`any`\> \| `DSLMethodOpts`<`any`\> |

#### Returns

`void`

#### Inherited from

CstParser.many

#### Defined in

node_modules/@chevrotain/types/api.d.ts:137

___

### option

▸ `Protected` **option**<`OUT`\>(`idx`, `actionORMethodDef`): `undefined` \| `OUT`

Like `OPTION` with the numerical suffix as a parameter, e.g:
option(0, X) === OPTION(X)
option(1, X) === OPTION1(X)
option(2, X) === OPTION2(X)
...

**`see`** OPTION

#### Type parameters

| Name |
| :------ |
| `OUT` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `actionORMethodDef` | `GrammarAction`<`OUT`\> \| `DSLMethodOpts`<`OUT`\> |

#### Returns

`undefined` \| `OUT`

#### Inherited from

CstParser.option

#### Defined in

node_modules/@chevrotain/types/api.d.ts:113

___

### or

▸ `Protected` **or**(`idx`, `altsOrOpts`): `any`

Like `OR` with the numerical suffix as a parameter, e.g:
or(0, X) === OR(X)
or(1, X) === OR1(X)
or(2, X) === OR2(X)
...

**`see`** OR

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `altsOrOpts` | `IOrAlt`<`any`\>[] \| `OrMethodOpts`<`any`\> |

#### Returns

`any`

#### Inherited from

CstParser.or

#### Defined in

node_modules/@chevrotain/types/api.d.ts:126

▸ `Protected` **or**<`T`\>(`idx`, `altsOrOpts`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `altsOrOpts` | `IOrAlt`<`T`\>[] \| `OrMethodOpts`<`T`\> |

#### Returns

`T`

#### Inherited from

CstParser.or

#### Defined in

node_modules/@chevrotain/types/api.d.ts:127

___

### parse

▸ **parse**(`text`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cst?` | `CstNode` |
| `errors` | `BluehawkError`[] |

#### Defined in

[src/bluehawk/parser/RootParser.ts:275](https://github.com/krollins-mdb/bluehawk/blob/f65f7b1e/src/bluehawk/parser/RootParser.ts#L275)

___

### performSelfAnalysis

▸ `Protected` **performSelfAnalysis**(): `void`

This must be called at the end of a Parser constructor.
See: http://chevrotain.io/docs/tutorial/step2_parsing.html#under-the-hood

#### Returns

`void`

#### Inherited from

CstParser.performSelfAnalysis

#### Defined in

node_modules/@chevrotain/types/api.d.ts:17

___

### reset

▸ **reset**(): `void`

Resets the parser state, should be overridden for custom parsers which "carry" additional state.
When overriding, remember to also invoke the super implementation!

#### Returns

`void`

#### Inherited from

CstParser.reset

#### Defined in

node_modules/@chevrotain/types/api.d.ts:46

___

### subrule

▸ `Protected` **subrule**<`ARGS`\>(`idx`, `ruleToCall`, `options?`): `CstNode`

Like `SUBRULE` with the numerical suffix as a parameter, e.g:
subrule(0, X) === SUBRULE(X)
subrule(1, X) === SUBRULE1(X)
subrule(2, X) === SUBRULE2(X)
...

**`see`** SUBRULE

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ARGS` | extends `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `ruleToCall` | `ParserMethod`<`ARGS`, `CstNode`\> |
| `options?` | `SubruleMethodOpts`<`ARGS`\> |

#### Returns

`CstNode`

#### Inherited from

CstParser.subrule

#### Defined in

node_modules/@chevrotain/types/api.d.ts:919
