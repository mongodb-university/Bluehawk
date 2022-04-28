---
id: "use-cases"
title: "Use Cases"
sidebar_label: "Use Cases"
sidebar_position: 3
custom_edit_url: null
---

### Tested Code Examples

Imagine you want to paste some code from a unit test into your docs. You can
mark up the unit test input file like this with Bluehawk tags like
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
`:state-end:` tags:

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
copied or transformed to the output directory. This makes it easy to copy one state
of the entire tutorial source into another repo that learners can clone.
