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

[src/bluehawk/parser/RootParser.ts:103](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L103)

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

node_modules/chevrotain/lib/chevrotain.d.ts:38

___

### \_bluehawkErrors

• `Private` **\_bluehawkErrors**: `BluehawkError`[] = `[]`

#### Defined in

[src/bluehawk/parser/RootParser.ts:327](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L327)

___

### annotatedText

• **annotatedText**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:91](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L91)

___

### attributeList

• **attributeList**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:99](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L99)

___

### blockCommand

• **blockCommand**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:93](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L93)

___

### blockCommandUncommentedContents

• **blockCommandUncommentedContents**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:94](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L94)

___

### blockComment

• **blockComment**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:97](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L97)

___

### chunk

• **chunk**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:92](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L92)

___

### command

• **command**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:95](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L95)

___

### commandAttribute

• **commandAttribute**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:96](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L96)

___

### errors

• **errors**: `IRecognitionException`[]

#### Inherited from

CstParser.errors

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:28

___

### input

• **input**: `IToken`[]

#### Inherited from

CstParser.input

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:847

___

### languageSpecification

• `Optional` **languageSpecification**: [`LanguageSpecification`](../interfaces/LanguageSpecification)

#### Defined in

[src/bluehawk/parser/RootParser.ts:101](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L101)

___

### lexer

• **lexer**: `Lexer`

#### Defined in

[src/bluehawk/parser/RootParser.ts:89](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L89)

___

### lineComment

• **lineComment**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:98](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L98)

___

### pushParser

• **pushParser**: `Rule` = `UndefinedRule`

#### Defined in

[src/bluehawk/parser/RootParser.ts:100](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L100)

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

node_modules/chevrotain/lib/chevrotain.d.ts:87

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

node_modules/chevrotain/lib/chevrotain.d.ts:679

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

node_modules/chevrotain/lib/chevrotain.d.ts:768

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

node_modules/chevrotain/lib/chevrotain.d.ts:73

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

node_modules/chevrotain/lib/chevrotain.d.ts:184

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

node_modules/chevrotain/lib/chevrotain.d.ts:864

___

### MANY

▸ `Protected` **MANY**(`actionORMethodDef`): `void`

Parsing DSL method, that indicates a repetition of zero or more.
This is equivalent to EBNF repetition {...}.

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

node_modules/chevrotain/lib/chevrotain.d.ts:507

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

node_modules/chevrotain/lib/chevrotain.d.ts:612

___

### OPTION

▸ `Protected` **OPTION**<`OUT`\>(`actionORMethodDef`): `OUT`

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

`OUT`

#### Inherited from

CstParser.OPTION

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:271

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

node_modules/chevrotain/lib/chevrotain.d.ts:407

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

node_modules/chevrotain/lib/chevrotain.d.ts:408

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:415

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:422

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:429

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:436

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:443

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:450

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:457

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:464

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

docs/node_modules/chevrotain/lib/chevrotain.d.ts:471

___

### OVERRIDE\_RULE

▸ `Protected` **OVERRIDE_RULE**<`T`\>(`name`, `implementation`, `config?`): (`idxInCallingRule?`: `number`, ...`args`: `any`[]) => `CstNode`

Overrides a Grammar Rule
See usage example in: https://github.com/chevrotain/chevrotain/blob/master/examples/parser/versioning/versioning.js

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `implementation` | (...`implArgs`: `any`[]) => `any` |
| `config?` | `IRuleConfig`<`CstNode`\> |

#### Returns

`fn`

▸ (`idxInCallingRule?`, ...`args`): `CstNode`

Overrides a Grammar Rule
See usage example in: https://github.com/chevrotain/chevrotain/blob/master/examples/parser/versioning/versioning.js

##### Parameters

| Name | Type |
| :------ | :------ |
| `idxInCallingRule?` | `number` |
| `...args` | `any`[] |

##### Returns

`CstNode`

#### Inherited from

CstParser.OVERRIDE\_RULE

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:888

___

### RULE

▸ `Protected` **RULE**(`name`, `implementation`, `config?`): (`idxInCallingRule?`: `number`, ...`args`: `any`[]) => `CstNode`

Creates a Grammar Rule

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `implementation` | (...`implArgs`: `any`[]) => `any` |
| `config?` | `IRuleConfig`<`CstNode`\> |

#### Returns

`fn`

▸ (`idxInCallingRule?`, ...`args`): `CstNode`

Creates a Grammar Rule

##### Parameters

| Name | Type |
| :------ | :------ |
| `idxInCallingRule?` | `number` |
| `...args` | `any`[] |

##### Returns

`CstNode`

#### Inherited from

CstParser.RULE

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:878

___

### SKIP\_TOKEN

▸ `Protected` **SKIP_TOKEN**(): `IToken`

#### Returns

`IToken`

#### Inherited from

CstParser.SKIP\_TOKEN

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:849

___

### SUBRULE

▸ `Protected` **SUBRULE**(`ruleToCall`, `options?`): `CstNode`

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `ruleToCall` | (`idx`: `number`) => `CstNode` |
| `options?` | `SubruleMethodOpts` |

#### Returns

`CstNode`

#### Inherited from

CstParser.SUBRULE

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:925

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

node_modules/chevrotain/lib/chevrotain.d.ts:148

___

### canTokenTypeBeInsertedInRecovery

▸ `Protected` **canTokenTypeBeInsertedInRecovery**(`tokType`): `boolean`

By default all tokens type may be inserted. This behavior may be overridden in inheriting Recognizers
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

node_modules/chevrotain/lib/chevrotain.d.ts:838

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

node_modules/chevrotain/lib/chevrotain.d.ts:62

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

node_modules/chevrotain/lib/chevrotain.d.ts:97

___

### getBaseCstVisitorConstructor

▸ **getBaseCstVisitorConstructor**(): (...`args`: `any`[]) => `ICstVisitor`<`any`, `any`\>

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

node_modules/chevrotain/lib/chevrotain.d.ts:46

___

### getBaseCstVisitorConstructorWithDefaults

▸ **getBaseCstVisitorConstructorWithDefaults**(): (...`args`: `any`[]) => `ICstVisitor`<`any`, `any`\>

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

node_modules/chevrotain/lib/chevrotain.d.ts:50

___

### getGAstProductions

▸ **getGAstProductions**(): `Record`<`string`, `Rule`\>

#### Returns

`Record`<`string`, `Rule`\>

#### Inherited from

CstParser.getGAstProductions

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:54

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

node_modules/chevrotain/lib/chevrotain.d.ts:843

___

### getSerializedGastProductions

▸ **getSerializedGastProductions**(): `ISerializedGast`[]

#### Returns

`ISerializedGast`[]

#### Inherited from

CstParser.getSerializedGastProductions

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:56

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

node_modules/chevrotain/lib/chevrotain.d.ts:829

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

node_modules/chevrotain/lib/chevrotain.d.ts:135

___

### option

▸ `Protected` **option**<`OUT`\>(`idx`, `actionORMethodDef`): `OUT`

Like `OPTION` with the numerical suffix as a parameter, e.g:
option(0, X) === OPTION(X)
option(1, X) === OPTION1(X)
option(2, X) === OPTION2(X)
...

**`see`** SUBRULE

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

`OUT`

#### Inherited from

CstParser.option

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:111

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

node_modules/chevrotain/lib/chevrotain.d.ts:124

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

node_modules/chevrotain/lib/chevrotain.d.ts:125

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

[src/bluehawk/parser/RootParser.ts:277](https://github.com/mongodben/Bluehawk/blob/d355b52/src/bluehawk/parser/RootParser.ts#L277)

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

node_modules/chevrotain/lib/chevrotain.d.ts:15

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

node_modules/chevrotain/lib/chevrotain.d.ts:44

___

### subrule

▸ `Protected` **subrule**(`idx`, `ruleToCall`, `options?`): `CstNode`

Like `SUBRULE` with the numerical suffix as a parameter, e.g:
subrule(0, X) === SUBRULE(X)
subrule(1, X) === SUBRULE1(X)
subrule(2, X) === SUBRULE2(X)
...

**`see`** SUBRULE

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |
| `ruleToCall` | (`idx`: `number`) => `CstNode` |
| `options?` | `SubruleMethodOpts` |

#### Returns

`CstNode`

#### Inherited from

CstParser.subrule

#### Defined in

node_modules/chevrotain/lib/chevrotain.d.ts:902
