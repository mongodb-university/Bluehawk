# Bluehawk

Bluehawk is a markup processor for extracting and manipulating arbitrary code.
With Bluehawk, you can:

- Extract code examples for use in documentation
- Generate formatted code examples for use in documentation
- Replace "finished" code with "todo" code for a branch in a tutorial repo

> 💡 See our [API Documentation](https://mongodb-university.github.io/Bluehawk/) or
> [open an issue](https://github.com/mongodb-university/Bluehawk/issues/new)

## Example

Say you're documenting a library. To provide code examples for library functionality,
you're forced to copy & paste snippets of code from test cases you've written into
your documentation. Every time an API changes, or you want to improve an example, or
you want to fix a bug, you have to copy & paste those snippets again. Sooner or later
you'll miss a line, or forget to copy and paste a change from your tests to the
documentation, or forget to update a line highlight... because you're trying to
maintain equivalent code snippets in two places at once.

What if there was a better way? What if you could write your examples in one place,
and let a tool take care of removing your assertions and setup and copying the
examples into your documentation? Bluehawk does exactly that.

## Install

Install the CLI globally:

```sh
npm install -g bluehawk
```

## Bluehawk Commands

Bluehawk **commands** come in two forms: _single-line_ and _block_. Single-line comments
operate upon the next line, while block comments operate upon the span of lines between
the start of the command and the end of the command, specified with `-start` and `-end`
suffixes. You use either single-line commenting or block commenting for all tags. To avoid
name clashing with various languages and markup frameworks, all Bluehawk commands begin
and end with colons (`:`).

> 💡 For a summary of all of the commands available in your local installation
> of Bluehawk, run `bluehawk list commands`.

### Snippet

The `snippet` command, also aliased as `code-block`, marks a range of content in a file
as a snippet. You can use the [snip](#snip) CLI command to generate snippet files from
these snippets. Because `snippet` operates on ranges of content, it is only available as
a block command. You must pass `snippet` an identifier.

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

### State

The `state` command marks a range of content in a file as part of a particular state.
You can use the [snip](#snip) or [copy](#copy) CLI commands with the [state](#state)
flag to generate output files that contain only content from a specific named state.
Because `state` operates on ranges of content, it is only available as
a block command. You must pass `state` an identifier.

Consider the following file:

`Main.java`:

```java
public class Main {
  public static void main(String[] args){
    // :snippet-start: example
    int example = 1;
    // :state-start: hello-world
    System.out.println("Hello world!");
    // :state-end:
    // :state-start: hello-user
    System.out.println("Hello user!");
    // :state-end:
    example++;
    // :snippet-end:
  }
}
```

Running the following command:

```
bluehawk snip Main.java -d . --state hello-user
```

Produces the following output:

`Main.codeblock.example.java`:

```java
int example = 1;
System.out.println("Hello user!");
example++;
```

Alternatively, Running the following command:

```
bluehawk snip Main.java -d . --state hello-world
```

Produces the following output:

`Main.codeblock.example.java`:

```java
int example = 1;
System.out.println("Hello world!");
example++;
```

### State-Uncomment

The `state-uncomment` command combines the [state](#state) and [uncomment](#uncomment)
commands. In terms of syntax, `state-uncomment` works exactly the same as `state`,
except one layer of commenting is removed from the entire state in produced output.
Use `state-uncomment` to prevent executable code in a state from actually executing
in the source code you use to produce output.

Consider the following file:

`Main.java`:

```java
public class Main {
  public static void main(String[] args){
    // :snippet-start: add-or-subtract
    int example = 1;
    // :state-start: add-one
    example++;
    // :state-end:
    // :state-uncomment-start: subtract-one
    //example--;
    // :state--uncomment-end:
    System.out.println("Example: " + example);
    // :snippet-end:
  }
}
```

Running the following command:

```
bluehawk snip Main.java -d . --state subtract-one
```

Produces the following output:

`Main.codeblock.add-or-subtract.java`:

```java
    int example = 1;
    example--;
    System.out.println("Example: " + example);
```

> 💡 Note that Bluehawk has trimmed one layer of comments from the `hello-user`
> state in the produced code block.

With `state-uncomment`, you can create multiple valid end states but only run
one of those states when executing your source code.

### Uncomment

The `uncomment` command removes a single comment from the beginning of
each line of the spanned range in all output.
Because `uncomment` operates on ranges of content, it is only available as
a block command.

Consider the following file:

`Main.java`:

```java
public class Main {
  public static void main(String[] args){
    int example = 1;
    // :uncomment-start:
    //example--;
    // :uncomment-end:
    example++;
    System.out.println("Example: " + example);
  }
}
```

Running the following command:

```
bluehawk copy Main.java -d .
```

Produces the following output:

`Main.java`:

```java
public class Main {
  public static void main(String[] args){
    int example = 1;
    example--;
    example++;
    System.out.println("Example: " + example);
  }
}
```

### Replace

The `replace` command accepts a JSON dictionary called "terms" as input,
and replaces occurrences string keys in the map within the
spanned range with their map values in all output. You can use
`replace` to hide implementation details like complicated class names
or API endpoint URLs in generated output. Because `replace` operates
on ranges of content, it is only available as a block command.

Consider the following file:

`Main.java`:

```java
// :replace-start: {
//    "terms": {
//       "MyMainExample": "Main",
//       "www.example.com/rest/v1": "YOUR_REST_ENDPOINT_HERE"
//    }
// }

/*
 * MyMainExample -- a class that contains only a hello world main method
 * that defines a rest endpoint.
 */
public class MyMainExample {
  String rest_endpoint;

  public static void main(String[] args){
    System.out.println("Hello world!");
    rest_endpoint = "www.example.com/rest/v1"
  }
}
// :replace-end:
```

Running the following command:

```
bluehawk copy Main.java -d .
```

Produces the following output:

`Main.java`:

```java
/*
 * Main -- a class that contains only a hello world main method.
 */
public class Main {
  String rest_endpoint;

  public static void main(String[] args){
    System.out.println("Hello world!");
    rest_endpoint = "YOUR_REST_ENDPOINT_HERE"
  }
}
```

### Emphasize

The `emphasize` command only applies to [formatted](#format)
output. When the `--format` flag is not used to generate formatted
output, `emphasize` is discarded completely. When the `--format` flag
is specified, Bluehawk highlights all lines marked with `emphasize`
command in the specified markup language output. `emphasize` makes it
easier to keep the correct lines highlighted when you update code
samples, because it calculates the highlighted line numbers for you.
You can use `replace` as either a block command or a
line command.

Consider the following file:

`Main.java`:

```java
public class Main {
  public static void main(String[] args){
    // :code-block-start: modulo
    int dividend = 11;
    int divisor = 3;
    int modulus = dividend % divisor; // :emphasize:
    System.out.println(dividend + " % " + divisor + " = " + modulus);
    // :code-block-end:
  }
}
// :replace-end:
```

Running the following command:

```
bluehawk snip Main.java -d . --format=sphynx-rst
```

Produces the following output:

`Main.codeblock.modulo.java.code-block.rst`:

```rst
.. code-block:: java
   :emphasize-lines: 3

   int dividend = 11;
   int divisor = 3;
   int modulus = dividend % divisor;
   System.out.println(dividend + " % " + divisor + " = " + modulus);
```

### Remove

The `remove` command, also aliased as `hide`, removes the spanned
range from Bluehawk output. `remove` can be helpful for hiding
assertions and state setup from user-facing code samples.
You can use `remove` as either a block command or a
line command.

Consider the following file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args){
    // :code-block-start: division
    int dividend = 11;
    int divisor = 3;
    int quotient = dividend / divisor;
    assert(quotient == 3) // :remove:
    System.out.println(dividend + " / " + divisor + " = " + quotient);
    // :code-block-end:
  }
}
// :replace-end:
```

Running the following command:

```
bluehawk snip Main.java -d .
```

Produces the following output:

`Main.codeblock.division.java`:

```rst
int dividend = 11;
int divisor = 3;
int quotient = dividend / divisor;
System.out.println(dividend + " / " + divisor + " = " + quotient);
```

## CLI

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
output for any ignored file. You can use the `ignore` flag multiple times
in a single Bluehawk execution to ignore multiple patterns.

#### State

Pass a state's id to the `--state` flag to include only the contents of that
state, and no other states, in the generated output.

#### Format

Pass the name of a markup syntax to the `--format` flag when generating snippets
to generate a formatted version of that snippet in the specified markup syntax.
This command currently only supports
[reStructuredText](https://en.wikipedia.org/wiki/ReStructuredText) syntax using
the identifier `sphynx-rst`.

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
