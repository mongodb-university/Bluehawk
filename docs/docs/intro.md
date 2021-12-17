---
id: "intro"
title: "Bluehawk"
sidebar_label: "Intro"
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

### Videos

How do you use Bluehawk in workflows? Here are a couple of short video
overviews of how the MongoDB Developer Education team uses Bluehawk to create
code examples:

- [Bluehawk: Extract & Generate Code Examples](https://youtu.be/4G2n3Ps7qUY)
- [Bluehawk: Generate Code for Tutorial Apps](https://youtu.be/DyF4tOxS0zU)

## Contributing

For more information about how to run, build, or test Bluehawk yourself, see [CONTRIBUTING.md](CONTRIBUTING.md).
