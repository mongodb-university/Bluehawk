---
id: "tutorials"
title: "Create Checkpointed Tutorials"
slug: "/tutorials/"
sidebar_label: "Checkpointed Tutorials"
sidebar_position: 2
custom_edit_url: null
---

:::info
Do you prefer learning through videos? Check out our video on
[Generate Code for Tutorial Apps](/#generate-code-for-tutorial-apps)
:::

## State in Bluehawk

Bluehawk has a concept we call `state`. This gives you the ability to
represent different "states" for tutorials. For example, you might have
a `start` state where a code example is a `TODO:` block. Then, you might
have a `final` state where the actual code exists in that code block.

The Realm Docs team uses `state` to create checkpointed tutorials.
The output of a given state becomes a git repository branch; i.e. the `start`
branch. In this example, our
[Realm React Native tutorial's start branch](https://github.com/mongodb-university/realm-tutorial-react-native/blob/ee05c6d9eb8d2975e7f8d34679c8c2a94ce00298/providers/TasksProvider.js#L32)
features several `TODO:` blocks:

```js
// TODO: Open the project realm with the given configuration and store
// it in the realmRef. Once opened, fetch the Task objects in the realm,
// sorted by name, and attach a listener to the Task collection. When the
// listener fires, use the setTasks() function to apply the updated Tasks
// list to the state.
```

The `final` branch has [completed code](https://github.com/mongodb-university/realm-tutorial-react-native/blob/57cfbe9749972b50cbfa7df071d6cc60f1cc1f38/providers/TasksProvider.js#L32),
instead:

```js
Realm.open(config).then((projectRealm) => {
  realmRef.current = projectRealm;

  const syncTasks = projectRealm.objects("Task");
  let sortedTasks = syncTasks.sorted("name");
  setTasks([...sortedTasks]);
  sortedTasks.addListener(() => {
    setTasks([...sortedTasks]);
  });
});
```

We manage this in a single file using Bluehawk `state`. This simplifies
testing and maintaining the tutorials.

Under the covers, `state` is an identifier that the Bluehawk CLI uses
when it generates output.

You can use any string identifier you'd like as your `state` keyword;
we use `start`, `final`, `local`, and `sync` based on what we are teaching
in the tutorial. You use this identifier with a [state](/reference/tags#state)
or [state-uncomment](/reference/tags#state-uncomment) tag when you
annotate a tutorial's code files.

Then, when you use the CLI to extract code snippets, you pass the `state`
identifier you used when annotating the file to extract just the code
snippets for that state. You pass this [state as a flag](/reference/cli#state)
to the Bluehawk CLI [snip](/reference/cli#snip) or [copy](/reference/cli#copy)
commands.

## Annotate the Tutorial

Start by annotating your tutorial with [Bluehawk tags](/reference/tags).
As with [code snippets](code-snippets), you open and close a code block
with `snippet-start` and `snippet-end`. You can
[remove code](code-snippets#remove-code) if your tutorial
contains tests or boilerplate you don't want to expose in your documentation.
You can also [replace](code-snippets#replace) awkward terms with more
readable ones if you have any namespace issues, or want to rename things
for consistency across docs.

The key to tutorials, though, is adding `state` annotations where you want
the content to change based on which state you want to show. This example
is from the Realm React Native Tutorial
[TasksProvider.js file](https://github.com/mongodb/docs-realm/blob/master/tutorial/rn/providers/TasksProvider.js).

We start a snippet called `clean-up`. Then you see `// :state-start: final`.
In this code snippet, `final` is the identifier we use for
[the "final" branch](https://github.com/mongodb-university/realm-tutorial-react-native/blob/final/providers/TasksProvider.js)
in our clonable tutorial git repository. The code after the `final` state
start is the code that developers see in that branch.

Below that, you see `// :state-end: :state-uncomment-start: start` all
on the same line. This line ends the `:state-start: final` from a few lines
above. Then, it starts a new state, called `start`, and uncomments the
code in the `state-uncomment` section. The comment is "double commented" -
after uncommenting, it shows as a regular comment.

```js
// :snippet-start: clean-up
return () => {
  // cleanup function
  const projectRealm = realmRef.current;
  if (projectRealm) {
    // :state-start: final
    projectRealm.close();
    realmRef.current = null;
    // :state-end: :state-uncomment-start: start
    //// TODO: close the project realm and reset the realmRef's
    //// current value to null.
    // :state-uncomment-end:
    setTasks([]);
  }
};
// :snippet-end:
```

After we extract the snippets, this code block looks like this in the `final`
state:

```js
return () => {
  // cleanup function
  const projectRealm = realmRef.current;
  if (projectRealm) {
    projectRealm.close();
    realmRef.current = null;
    setTasks([]);
  }
};
```

And this in the `start` state:

```js
return () => {
  // cleanup function
  const projectRealm = realmRef.current;
  if (projectRealm) {
    // TODO: close the project realm and reset the realmRef's
    // current value to null.
    setTasks([]);
  }
};
```

You can see Bluehawk has removed one of the levels of comment nesting.
It shows only the `TODO:` block in the `start` state, while the
`final` state shows only the final code - not the `TODO` block at all.

## Use the CLI to Extract Snippets

After you have annotated your tutorial code, use the Bluehawk CLI to extract
code snippets. The process is the same as when
[extracting code examples](code-snippets#use-the-cli-to-extract-snippets),
because you're doing the same thing - you just pass an additional `--state`
flag to indicate which state you want in the code example.

As with extracting code examples, you use the `bluehawk snip` command,
and you can
[extract code from a single file](code-snippets#extract-code-from-a-single-file)
or [from a directory](code-snippets#extract-code-in-a-directory). But you
must run the command more than once, and each time you pass it the `state`
identifier whose code example you want to generate.

For example, for our annotated code above, we might use this command to
generate code for the `start` state:

```shell
bluehawk snip -o source/tutorial/generated/code/start/ tutorial/rn/providers/TasksProvider.js --state=start
```

And then use this command to generate code for the `final` state:

```shell
bluehawk snip -o source/tutorial/generated/code/final/ tutorial/rn/providers/TasksProvider.js --state=final
```

The input file is the same in both cases. The output directory is different.
Every output file follows the same
[naming convention](code-snippets#output-file-names), and there is
nothing in the file name to indicate the state that was used to generate
that file. In the example above, the generated file name would be
`TasksProvider.snippet.clean-up.js` in both cases.

## Include the Snippets In Your Documentation

After annotating your tutorial code and extracting code examples with the
Bluehawk CLI, you've got code files in output directories.

Now it's time to include those code files in your documentation.
How you do that depends on your documentation tooling. For info
about how the Realm docs team includes code examples in our documentation, see:
[Include Code Snippets In Your documentation](code-snippets#include-the-snippets-in-your-documentation).

### Automatically Update Tutorial Code

For our tutorial code, we do something extra. Our tutorial applications each
live in clonable GitHub artifact repositories so developers can clone and
run our tutorials. We have a
[GitHub Workflow](https://github.com/mongodb/docs-realm/blob/master/.github/workflows/push-to-artifact-repos.yml)
that manages updating these tutorial repositories; we don't push to these
repositories directly.

Instead, when we push to the `tutorial` directory in our documentation
repository, this GitHub workflow does a few things:

- It runs `bluehawk check` to [verify there are no Bluehawk errors](/reference/cli#check)
  in our files.
- It uses a [GitHub Action](https://github.com/mongodb/docs-realm/tree/master/.github/actions/push-to-artifact-repo)
  with a [Bluehawk plugin](https://github.com/cbush/bluehawk-plugin-git)
  to copy, commit, and push transformed code to artifact repos.

The GitHub Action copies code examples for each Bluehawk state to a git
branch whose name is the same as the state name. This means that our
tutorial repositories are automatically updated when we make updates to
the source code in our documentation repository.
