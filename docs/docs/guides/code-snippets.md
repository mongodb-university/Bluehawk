---
id: "code-snippets"
title: "Extract Code Snippets"
slug: "/code-snippets/"
sidebar_label: "Extract Code Snippets"
sidebar_position: 1
custom_edit_url: null
---

:::info
Do you prefer learning through videos? Check out our video on 
[Extract and Generate Code Examples](/#extract-and-generate-code-examples)
:::

## Annotate Unit Tests

The first step to use Bluehawk is to annotate your unit tests with 
[Bluehawk tags](/reference/tags). Tags are similar to HTML or XML; you 
put a `start` tag before the code you want to annotate, and an `end` tag
after it. Bluehawk reads those start and end tags, and generates output
files based on your annotations. You can use Bluehawk tags in any text file.

The Bluehawk tool has language-specific "comment awareness" - as well as 
string literal awareness - that allows it to:

- Avoid making snippet files with a closing block comment token at the front
- Parse multi-line, commented out JSON "attribute lists" of tags so they 
  don't create syntax errors in your code

### Output File Names

When you start a Bluehawk code block tag, you append a descriptive title, 
similar to:

```
// :snippet-start: person-model
```

When you generate Bluehawk output, the output file name concatenates:

- The name of your unit test file
- The word `codeblock`
- The descriptive name that you put in the `snippet-start` tag
- The file type of your unit test file

For this example, the code block is in a file called Models.swift, so
the generated output file name would be: `Models.codeblock.person-model.swift`.

### Example Unit Test Annotation

#### Snippet start and end

This is a complete code example in the 
[Models.swift](https://github.com/mongodb/docs-realm/blob/master/examples/ios/Examples/Models.swift)
file in the Realm Docs iOS Unit Test suite.

For this code snippet, we don't need to show the `import` statement in our final
example, so we start the snippet after it. Then, after the code we want
to show in our final example, we end the snippet.

```swift
import RealmSwift

// :snippet-start: person-model
class Person: Object {
    // Required string property
    @Persisted var name: String = ""

    // Optional string property
    @Persisted var address: String?

    // Optional integral type property
    @Persisted var age: Int?
}
// :snippet-end:
```

The output file becomes 
[Models.codeblock.person-model.swift](https://github.com/mongodb/docs-realm/blob/master/source/examples/generated/code/start/Models.codeblock.person-model.swift). After we use the Bluehawk CLI to extract 
this code example, the final code example looks like this:

```swift
class Person: Object {
    // Required string property
    @Persisted var name: String = ""

    // Optional string property
    @Persisted var address: String?

    // Optional integral type property
    @Persisted var age: Int?
}
```

The output file includes only the lines of code between the `snippet-start` 
and the `snippet-end` tags.

#### Hide or Remove code

Bluehawk lets you to hide or remove code that isn't relevant to your 
documentation viewers.

This example is from the [ManageEmailPasswordUsers.swift](https://github.com/mongodb/docs-realm/blob/master/examples/ios/Examples/ManageEmailPasswordUsers.swift) file in the Realm Docs iOS Unit Test suite.

This uses the snippet start and end tags, but it also uses `// :hide-start:`
and `// :hide-end:` to hide elements of the code example. Here, we're hiding
a test assertion in the `catch` block that the documentation viewer doesn't 
need to see. You might also use it to hide test setup or teardown code 
that isn't relevant to your documentation viewers.

```swift
    func testPasswordResetFunc() async {
        // :snippet-start: password-reset-function
        let app = App(id: YOUR_REALM_APP_ID)
        let client = app.emailPasswordAuth

        let email = "forgot.my.password@example.com"
        let newPassword = "mynewpassword12345"
        // The password reset function takes any number of
        // arguments. You might ask the user to provide answers to
        // security questions, for example, to verify the user
        // should be able to complete the password reset.
        let args: [AnyBSON] = []

        // This SDK call maps to the custom password reset
        // function that you define in the backend
        do {
            try await client.callResetPasswordFunction(email: email, password: newPassword, args: args)
            print("Password reset successful!")
        } catch {
            print("Password reset failed: \(error.localizedDescription)")
            // :hide-start:
            XCTAssertEqual(error.localizedDescription, "user not found")
            // :hide-end:
        }
        // :snippet-end:
    }
```

The final output code example at 
[ManageEmailPasswordUsers.codeblock.password-reset-function.swift](https://github.com/mongodb/docs-realm/blob/master/source/examples/generated/code/start/ManageEmailPasswordUsers.codeblock.password-reset-function.swift)
looks like:

```swift
let app = App(id: YOUR_REALM_APP_ID)
let client = app.emailPasswordAuth

let email = "forgot.my.password@example.com"
let newPassword = "mynewpassword12345"
// The password reset function takes any number of
// arguments. You might ask the user to provide answers to
// security questions, for example, to verify the user
// should be able to complete the password reset.
let args: [AnyBSON] = []

// This SDK call maps to the custom password reset
// function that you define in the backend
do {
    try await client.callResetPasswordFunction(email: email, password: newPassword, args: args)
    print("Password reset successful!")
} catch {
    print("Password reset failed: \(error.localizedDescription)")
}
```

The `catch` block does not show the hidden assertion; it only shows the
print line.

#### Replace

Bluehawk gives you the ability to replace terms with different terms, or even
nothing at all. In the Realm Docs iOS Unit Test suite, we use the `replace` 
tag to hide awkward names we have to use to avoid namespace collisions. 
For example, here are the opening lines of the 
[ReadWriteData.swift](https://github.com/mongodb/docs-realm/blob/master/examples/ios/Examples/ReadWriteData.swift) 
file:

```swift
// :replace-start: {
//   "terms": {
//     "ReadWriteDataExamples_": ""
//   }
// }
import XCTest
import RealmSwift

// :snippet-start: models
class ReadWriteDataExamples_DogToy: Object {
    @Persisted var name = ""
}

class ReadWriteDataExamples_Dog: Object {
    @Persisted var name = ""
    @Persisted var age = 0
    @Persisted var color = ""
    @Persisted var currentCity = ""

    // To-one relationship
    @Persisted var favoriteToy: ReadWriteDataExamples_DogToy?
}

class ReadWriteDataExamples_Person: Object {
    @Persisted(primaryKey: true) var id = 0
    @Persisted var name = ""

    // To-many relationship - a person can have many dogs
    @Persisted var dogs: List<ReadWriteDataExamples_Dog>

    // Inverse relationship - a person can be a member of many clubs
    @Persisted(originProperty: "members") var clubs: LinkingObjects<ReadWriteDataExamples_DogClub>
}

class ReadWriteDataExamples_DogClub: Object {
    @Persisted var name = ""
    @Persisted var members: List<ReadWriteDataExamples_Person>
}
// :snippet-end:
// Many more lines of code examples, until eventually, we end the replace
// :replace-end:
```

As you can see, the model names such as `ReadWriteDataExamples_DogToy` are
very awkward. The `ReadWriteDataExamples` is present to avoid namespace
collisions with `Dog` or `Person` models in other test files. But this
awkward name isn't something we want to show documentation viewers.

Fortunately, replace lets us swap any instance of the term we specify with
some alternative. In this example, we replace `ReadWriteDataExamples`
with an empty string. 

```swift
// :replace-start: {
//   "terms": {
//     "ReadWriteDataExamples_": ""
//   }
// }
```

The [output file for the code block above](https://github.com/mongodb/docs-realm/blob/master/source/examples/generated/code/start/ReadWriteData.codeblock.models.swift) 
looks like:

```swift
class DogToy: Object {
    @Persisted var name = ""
}

class Dog: Object {
    @Persisted var name = ""
    @Persisted var age = 0
    @Persisted var color = ""
    @Persisted var currentCity = ""

    // To-one relationship
    @Persisted var favoriteToy: DogToy?
}

class Person: Object {
    @Persisted(primaryKey: true) var id = 0
    @Persisted var name = ""

    // To-many relationship - a person can have many dogs
    @Persisted var dogs: List<Dog>

    // Inverse relationship - a person can be a member of many clubs
    @Persisted(originProperty: "members") var clubs: LinkingObjects<DogClub>
}

class DogClub: Object {
    @Persisted var name = ""
    @Persisted var members: List<Person>
}
```

The long, awkward name has been replaced with nothing.

:::tip
Be careful with `replace`. Use VerySpecificNamesAndCharacters_ here so 
you can be sure you don't unintentionally delete something common.
:::

## Use the CLI to Extract Snippets

After you annotate your code examples with Bluehawk tags, use the 
Bluehawk CLI to parse the content. The CLI generates output files that contain
only the content you specify. The Bluehawk CLI accepts various 
[commands](/reference/cli) to generate output in the way you want it.

The most common command you'll use is `bluehawk snip`. When you snip code
blocks, you pass the output directory and the input file or directory.

```shell
bluehawk snip -o <output-directory> <input-directory-or-file>
```

### Extract Code from a Single File

If you're just updating a single code example or tutorial, you can extract 
code from a single file:

```shell
bluehawk snip -o source/examples/generated/code/start/ examples/ios/Examples/ReadWriteData.swift
```

This example extracts code snippets from the `ReadWriteData.swift` file, and
generates output files in `source/examples/generated/code/start/`. 

### Extract Code in a Directory

If you want to generate Bluehawk output for all the files in a directory,
you can pass a directory as an input source:

```shell
bluehawk snip -o source/examples/generated/code/start/ examples/ios/Examples
```

In this example, `examples/ios/examples` is the directory that contains all
of the Realm docs iOS unit test files. If we create new test files, or 
change existing tests, and then run this command, Bluehawk generates 
new or updated output files for all changes.

:::tip
Make an [alias](https://www.geeksforgeeks.org/alias-command-in-linux-with-examples/) 
for common Bluehawk commands. If you find yourself always running the same 
`bluehawk snip` command with the same input and output directories, make 
it a command-line alias. I have `bluehawkify` and `bluehawkify-android` as 
aliases for common Bluehawk CLI commands.
:::

## Include the Snippets In Your Documentation

After annotating code examples and extracting them with the Bluehawk CLI,
you've got code files in an output directory.

Now it's time to include those code blocks in your documentation.
How you do that depends on your documentation tooling.

In Realm documentation, our build system uses reStructured Text (rST), which 
[has an `include` option](https://docutils.sourceforge.io/docs/ref/rst/directives.html#include) 
that looks like:

```
.. literalinclude:: /examples/generated/code/start/ReadWriteData.codeblock.models.swift
   :language: swift
```

In [Docusaurus](https://docusaurus.io/docs/static-assets), you would `import` 
the file from a generated file directory and use it in a special block:

```
import QuickStartTestCodeblockUpdateRealmObjectDart from "!!raw-loader!@site/generated/flutter/quick_start_test.codeblock.update-realm-object.dart";

<CodeBlock className="language-dart">
  {QuickStartTestCodeblockUpdateRealmObjectDart}
</CodeBlock>
```

Consult your documentation tooling for the best way to include external files
in your documentation set.
