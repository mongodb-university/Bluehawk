# Bluehawk

Bluehawk is a markup processor for extracting and manipulating arbitrary code.
In particular, it can:

- Extract code examples for use in documentation
- Replace "finished" code with "todo" code for a branch in a tutorial repo

## Background

A concept originally lifted from another internal project called "peekaboo", the
idea is that you can develop finalized code (say, a complete tutorial
application that runs), and then strip out parts that you want the learner to
figure out and code themselves. So, one code base (compiles, passes tests, etc.)
can be used to generate both a "starter" version for a learner and a "final"
version so they can check their work... or just download it and cheat.

Additionally, we needed a way to leave our code examples in compileable,
testable projects while extracting the relevant part to paste in our docs.

## How to run Bluehawk

First, install dependencies:

```sh
npm install
```

To build, run:

```
npm run build
```

If compilation is successful, you can run bluehawk like so:

```sh
node build/index.js -s <folder to source file or directory>
```

Which you can alias (until release):

```sh
alias bluehawk="node /path/to/bluehawk/build/index.js"
```

The `-s or --source` parameter is required.

In order to do anything useful, you can use the following flags:

- `--state <state name>`: Output the given `state name` version of files. When Bluehawk
  encounters a `state` command (see below), multiple versions of the source file
  are spawned. Each version removes any code in state commands that are **not**
  marked with the corresponding state name. This flag determines which version
  to eventually write to disk.

  When not combined with `snippets`, this retains the relative structure of the
  project.
- `--snippets`: Output snippet files only. Can be combined with `--state`.
- `-d or --destination` defines the output location.


## Command Markup

When generating code blocks from a code file, use the following markup. Note: you
use either single-line commenting or block commenting for all tags to keep the
compiler happy.

| Syntax                      | Description                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **:snippet-start:** _id_    | Creates a new snippet file, which will be output as `<sourcefilename>.codeblock.<id>.<source file extension>` |
|                             |                                                                             |
| **:remove-start:**          | The inner content will be removed from all output.                          |
|                             |                                                                             |
| **:state-start:** _state_   | Marks this content for removal from any state file except _state_.          |
|                             |                                                                             |
| **:state-uncomment-start:** _state_  | Marks this content for removal from any state file except _state_ and also removes up to one layer of comment tokens. |

All commands that end with `-start` have a corresponding `-end` command. You use
start and end commands to delineate blocks of content. Generally, the command
operates on the content within the block.


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
