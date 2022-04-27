# How to Run Bluehawk from Source

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
node build/src/cli/main.js snip -o <output directory> <folder to source file or directory>
```

Which you can alias as:

```sh
alias bluehawk-dev="node /path/to/bluehawk/build/src/cli/main.js"
```

# Running Tests

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

# Architecture

![Graphical overview of the Bluehawk architecture](https://raw.githubusercontent.com/mongodb-university/Bluehawk/main/architecture.png "Bluehawk Architecture")

Bluehawk has three major components:

- **Client:** loads files to be parsed and processed. Implements listeners that
  decide what to do with results (e.g. save to file). Can add custom tags
  and language specifications (i.e. comment syntax). The main client is the CLI,
  but you can use Bluehawk as a library and implement your own clients.
- **Parser:** finds tags in a source file and diagnoses markup errors.
- **Processor:** executes tags on a source file to produce transformed documents.

## File Language-Specific Tokens

The lexer can receive custom tokens for a given language to define comment
syntax. For example, plaintext has no comments, bash only has line comments
(#)[†](https://stackoverflow.com/questions/32126653/how-does-end-work-in-bash-to-create-a-multi-line-comment-block),
and C++ has line (//) and block (`/*`, `*/`) comments. Bluehawk is comment aware so
that it can correctly strip comments (when needed) and diagnose when tags
are halfway in a block comment.

## Tag Tokens

":snippet-start:", ":remove-start:", etc. are not keywords. Instead, the
lexer and parser detect [tag], [tag]-start, and [tag]-end. It is up
to the visitor to determine whether the -start and -end tag names match and
if the tag name is understood by Bluehawk. This keeps the lexer and parser
simpler and allows for extensibility of Bluehawk as users could eventually
provide their own tags.

## Attribute Lists

The original Bluehawk spec document included the ability to provide a JSON
object after a block tag to configure the block tag's attributes. The
lexer has "modes" so after it encounters a block tag, it goes into an
attribute mode, which will either accept the tag identifier (i.e.
:some-tag-start: this-is-the-identifier) or the attribute list JSON.
