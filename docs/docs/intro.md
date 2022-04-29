---
id: "intro"
title: "Bluehawk"
sidebar_label: "Introduction"
sidebar_position: -1
slug: /
---

Bluehawk is a markup processor for extracting and manipulating arbitrary code.
With Bluehawk, you can:

- Extract code examples for use in documentation
- Generate formatted code examples for use in documentation
- Replace "finished" code with "todo" code for a branch in a tutorial repo

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

## How to Use Bluehawk

To use Bluehawk:

1. You add special comments, called [tags](reference/tags), to code blocks or lines of source code.
2. Use the [Bluehawk CLI](reference/cli) to read the input files and generate output files based on the tags.
3. Include the output files that the Bluehawk CLI generated in your documentation.

For examples of how the Realm Docs team uses Bluehawk in workflows, see our guides:
- [Extract Code Snippets](code-snippets/)
- [Create Checkpointed Tutorials](tutorials)
- [Bluehawk in Continuous Integration](continuous-integration)

### Videos

How do you use Bluehawk in workflows? Here are a couple of short video
overviews of how the MongoDB Developer Education team uses Bluehawk to create
code examples:

#### Extract and Generate Code Examples

<iframe width="560" height="315" src="https://www.youtube.com/embed/4G2n3Ps7qUY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Generate Code for Tutorial Apps

<iframe width="560" height="315" src="https://www.youtube.com/embed/DyF4tOxS0zU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Contributing

For more information about how to run, build, or test Bluehawk yourself, see [CONTRIBUTING.md](https://github.com/mongodb-university/Bluehawk/blob/main/CONTRIBUTING.md).
