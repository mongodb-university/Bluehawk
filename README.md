# Bluehawk

Bluehawk is a markup processor for extracting and manipulating arbitrary code.
With Bluehawk, you can:

- Extract code examples for use in documentation
- Generate formatted code examples for use in documentation
- Replace "finished" code with "todo" code for a branch in a tutorial repo

> 💡 See our [API Documentation](https://mongodb-university.github.io/Bluehawk/) or
> [open an issue](https://github.com/mongodb-university/Bluehawk/issues/new)

# CLI

## Install

Install the CLI globally:

```sh
npm install -g bluehawk
```

## Usage

### Commands

Use commands to generate different kinds of output with Bluehawk, including
code blocks, full files of code, and even error checks.

> 💡 Commands for the Bluehawk CLI are not the same as
> [Bluehawk Commands](#bluehawk-commands), the syntax
> interpreted by Bluehawk to process input files.

#### Snip

```
bluehawk snip --destination <output-directory> <input-directory-or-file>
```

Output "snippet files" that contain only the content of `code-block` or
`snippet` Bluehawk commands, named in the format
`<source-file-name>.codeblock.<codeblock-name>.<source-file-extension>`.
By default, this command generates snippets
that include only the _last_ (chronologically ordered in your file)
state listed for each group of `state` Bluehawk commands. However,
you can use the `--state` flag to generate snippet files that include
content from a single state that you specify.

#### Copy

```
bluehawk copy --destination <output-directory> <input-directory-or-file>
```

Output full bluehawk-processed input files to destination directory.
By default, this command generates output files that omit all `state`.
However, you can use `--state` flag to generate output files that
include content from a single state that you specify.

#### Check

```
bluehawk check <input-directory-or-file>
```

Generates non-zero output if processing any input files generates a Bluehawk
error, zero output otherwise. Does not generate any files: instead, `check`
outputs directly to command line.

### Flags

You can use flags to tweak the output of Bluehawk.

#### Ignore

Pass a pattern to the `--ignore` flag to omit any file that matches that
pattern from Bluehawk's input files. Bluehawk will not process or generate
output for any ignored file.

#### State

Pass a state's id to the `--state` flag to include only the contents of that
state, and no other states, in the generated output.

#### Format

Pass the name of a markup syntax to the `--format` flag when generating snippets
to generate a formatted version of that snippet in the specified markup syntax.
This command currently only supports
[reStructuredText](https://en.wikipedia.org/wiki/ReStructuredText) syntax using
the identifier `sphynx-rst`.

# Bluehawk Commands

Bluehawk **commands** come in two forms: _single-line_ and _block_. Single-line comments
operate upon the next line, while block comments operate upon the span of lines between
the start of the command and the end of the command, specified with `-start` and `-end`
suffixes. You use either single-line commenting or block commenting for all tags.

# Snippet

The `snippet` command, also aliased as `code-block`, marks a range of content in a file
as a snippet. You can use the [snip](#snip) CLI command to generate snippet files from
these snippets.

Consider the following file:

`Main.java`:

```java
public class Main {
	public static void main(String[] args){
		// :snippet-start: test-block
		System.out.println("Hello world!");
		// :snippet-end:
	}
}
```

Running the following command:

```
bluehawk snip Main.java -d .
```

Produces the following output:

`Main.codeblock.test-block.java`:

```java
System.out.println("Hello world!");
```

Use `bluehawk list commands` to list available commands.

snippet
identifies snippets for extraction into standalone files
block mode supported: yes
line mode supported: no
attributes schema: {"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}

code-block (alias of snippet)
identifies snippets for extraction into standalone files
block mode supported: yes
line mode supported: no
attributes schema: {"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}

state
given a state name as command id, identifies blocks that should only appear in the given state's version of the file
block mode supported: yes
line mode supported: no
attributes schema: {"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}

state-uncomment
combines 'uncomment' and 'state'
block mode supported: yes
line mode supported: no
attributes schema: {"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}

uncomment
removes up to one line comment token from every line in its range
block mode supported: yes
line mode supported: no
attributes schema: {"type":"null","nullable":true}

replace
given 'terms' object in the attribute list, replaces term keys with corresponding values within the block
block mode supported: yes
line mode supported: no
attributes schema: {"type":"object","required":["terms"],"properties":{"terms":{"type":"object","minProperties":1,"additionalProperties":{"type":"string"},"required":[]}}}

emphasize
identify line(s) to highlight (see `bluehawk snip --format` command)
block mode supported: yes
line mode supported: yes
attributes schema: {"type":"null","nullable":true}

hide (alias of remove)
deletes line(s) from the result
block mode supported: yes
line mode supported: yes
attributes schema: {"type":"null","nullable":true}

remove
deletes line(s) from the result
block mode supported: yes
line mode supported: yes
attributes schema: {"type":"null","nullable":true}

## Use Cases

### Tested Code Examples

Imagine you want to paste some code from a unit test into your docs. You can
mark up the unit test source file like this with Bluehawk commands like
`:snippet-start:`, `:snippet-end:`, `:remove-start:`, and `:remove-end:`:

```swift
// SomeTest.swift

// ... more tests ...
func someTest() {
    // :snippet-start: some-example
    let person = getPerson()
    // :remove-start: // hide test boilerplate from the code block
    XCTAssert(person.name != "Keith")
    // :remove-end:
    person.doSomething {
        person.doSomethingElse()
    }
    // :snippet-end:
}
// ... more tests ...
```

Running Bluehawk with the `snip` command on this file will produce a snippet
file called `SomeTest.codeblock.some-example.swift` that looks something like this:

```swift
let person = getPerson()
person.doSomething {
    person.doSomethingElse()
}
```

You can now import this snippet into your documentation. Now you have the
benefit of tested examples that are still easy to read in the docs.

Bluehawk markup can go into any source file, so you don't need to rig every unit
test framework you use up to also extract code examples. Just use Bluehawk with
the unit test framework that suits your language and your project. Heck, you don't
even need a unit test framework. Use Bluehawk in your app or bash script that you
run to make sure everything's still more or less working.

### Checkpointed Tutorials

Suppose you have a tutorial repo that learners can clone to follow along with
your tutorial from a certain starting point, say a "start" branch. You also want
learners to be able to check out a "final" branch so they can see the finished
project. As the tutorial developer, you would have to maintain these two state
branches, which can be tedious and error prone.

To manage this process, you can use Bluehawk to mark up your tutorial source and
indicate different states or checkpoints with the `:state-start:` and
`:state-end:` commands:

```swift
// WelcomeViewController.swift

// ... more code ...
// :snippet-start: sign-up
@objc func signUp() {
    // :state-start: final
    setLoading(true);
    app.emailPasswordAuth.registerUser(email: email!, password: password!, completion: { [weak self](error) in
        DispatchQueue.main.async {
            self!.setLoading(false);
            ...
        }
    })
    // :state-end:
    // :state-start: start
    // TODO: Use the app's emailPasswordAuth to registerUser with the email and password.
    // When registered, call signIn().
    // :state-uncomment-end:
}
// :snippet-end:
// ... more code ...
```

Running `bluehawk copy` on this file with `--state start` results in a copy of
`WelcomeViewController.swift` that looks something like this:

```swift
// WelcomeViewController.swift

// ... more code ...
@objc func signUp() {
    // TODO: Use the app's emailPasswordAuth to registerUser with the email and password.
    // When registered, call signIn().
}
// ... more code ...
```

Notice that you still have all of the boilerplate, but no final implementation
code. Only the "TODO" is left.

Using the `--state final` flag produces another version of
`WelcomeViewController.swift` that has the boilerplate and the final
implementation code, but no "TODO":

```swift
// WelcomeViewController.swift

// ... more code ...
@objc func signUp() {
    setLoading(true);
    app.emailPasswordAuth.registerUser(email: email!, password: password!, completion: { [weak self](error) in
        DispatchQueue.main.async {
            self!.setLoading(false);
            ...
        }
    })
}
// ... more code ...
```

You can run Bluehawk on an entire directory, and each file in the repo will be
copied or transformed to the destination. This makes it easy to copy one state
of the entire tutorial source into another repo that learners can clone.

## Plugins

You can add commands and listeners by creating a JS file or node project that
implements the register() function:

```js
// myPlugin.js
exports.register = (bluehawk) => {
  // Register a new command, :my-command:
  bluehawk.registerCommand("my-command", {
    rules: [],
    process: (request) => {
      // Execute command
    },
  });

  // Register a document listener
  bluehawk.subscribe((finishedDocument) => {
    // Do something with finishedDocument
  });
};
```

Usage:

```shell
bluehawk --plugin ./myPlugin source.txt
```

You can pass the --plugin flag multiple times to load different plugins or create a plugin that is composed of other plugins.

## Usage as a Module

```sh
npm install bluehawk
```

## How to Run Bluehawk from Source

To build and run Bluehawk from source, clone this repo and install dependencies:

```sh
npm install
```

To build, run:

```
npm run build
```

If compilation is successful, you can run bluehawk like so:

```sh
node build/src/cli/main.js snip -d <destination directory> <folder to source file or directory>
```

Which you can alias as:

```sh
alias bluehawk-dev="node /path/to/bluehawk/build/src/cli/main.js"
```

## Running Tests

This project uses Jest to test.

To run all tests, use:

```sh
npm test
```

To run the tests and get verbose output for all unit tests, use:

```sh
npm run verbose
```

Additionally, you can get a Jest coverage report with:

```sh
npm run coverage
```

You can also run tests with breakpoints in VS Code with F5. See .vscode/launch.json.

## Background

A concept originally lifted from another internal project called "peekaboo", the
idea is that you can develop finalized code (say, a complete tutorial
application that runs), and then strip out parts that you want the learner to
figure out and code themselves. So, one code base (compiles, passes tests, etc.)
can be used to generate both a "starter" version for a learner and a "final"
version so they can check their work... or just download it and cheat.

Additionally, we needed a way to leave our code examples in compileable,
testable projects while extracting the relevant part to paste in our docs.

## Architecture

![Graphical overview of the Bluehawk architecture](https://raw.githubusercontent.com/mongodb-university/Bluehawk/main/architecture.png "Bluehawk Architecture")

Bluehawk has three major components:

- **Client:** loads files to be parsed and processed. Implements listeners that
  decide what to do with results (e.g. save to file). Can add custom commands
  and language specifications (i.e. comment syntax). The main client is the CLI,
  but you can use Bluehawk as a library and implement your own clients.
- **Parser:** finds commands in a source file and diagnoses markup errors.
- **Processor:** executes commands on a source file to produce transformed documents.

### File Language-Specific Tokens

The lexer can receive custom tokens for a given language to define comment
syntax. For example, plaintext has no comments, bash only has line comments
(#)[†](https://stackoverflow.com/questions/32126653/how-does-end-work-in-bash-to-create-a-multi-line-comment-block),
and C++ has line (//) and block (`/*`, `*/`) comments. Bluehawk is comment aware so
that it can correctly strip comments (when needed) and diagnose when commands
are halfway in a block comment.

### Command Tokens

":snippet-start:", ":remove-start:", etc. are not keywords. Instead, the
lexer and parser detect [command], [command]-start, and [command]-end. It is up
to the visitor to determine whether the -start and -end command names match and
if the command name is understood by Bluehawk. This keeps the lexer and parser
simpler and allows for extensibility of Bluehawk as users could eventually
provide their own commands.

### Attribute Lists

The original Bluehawk spec document included the ability to provide a JSON
object after a block command to configure the block command's attributes. The
lexer has "modes" so after it encounters a block command, it goes into an
attribute mode, which will either accept the command identifier (i.e.
:some-command-start: this-is-the-identifier) or the attribute list JSON.
