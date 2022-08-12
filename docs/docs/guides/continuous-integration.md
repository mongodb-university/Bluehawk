---
id: "continuous-integration"
title: "Continuous Integration"
slug: "/continuous-integration/"
sidebar_label: "Continuous Integration"
sidebar_position: 3
custom_edit_url: null
---

Because the Bluehawk CLI is a package you can 
[install with `npm`](/install#usage-as-a-module), you can use it in your 
continuous integration workflows. 

In the Realm documentation team, we use it in a couple of different ways:

- Check for Bluehawk errors when we push updates to files that might use Bluehawk
- Use Bluehawk to update tutorial artifact repositories when we push updates to tutorials

## Check for Bluehawk Errors

In the Realm documentatation GitHub repository, we have a 
[GitHub Workflow](https://github.com/mongodb/docs-realm/blob/master/.github/workflows/bluehawk.yml)
that uses [bluehawk check](/reference/cli#check) to check for errors when 
we push to specific directories. The command we execute in the workflow is:

```shell
npx bluehawk check -i "*.md" -i "*.properties" -i "*.lock" examples tutorial
```

This does a few things:

- Uses `bluehawk check` to tell us if there are Bluehawk errors in our files
- Ignores files of certain types:
  - Markdown files
  - Properties files
  - Lock files
- Checks for updates in the `examples` or `tutorial` directories, which are the 
two directories where we use Bluehawk

This way, if we push a file to GitHub in one of these directories, and the 
file has Bluehawk errors, the check will fail and we won't merge the PR.
This is similar to checking for build errors when we generate our documentation.

## Use Bluehawk in GitHub Workflows and Actions

We also use Bluehawk in our CI in more complex ways. Our 
[Tutorials guide](/tutorials) explains how we use `bluehawk state` to generate 
code examples for our tutorials. 

We also use Bluehawk in GitHub Workflows and Actions that automatically
update artifact repositories when we push changes to our tutorials. We 
explain this in more depth in 
[Tutorials -> Automatically Update Tutorial Code](/tutorials#automatically-update-tutorial-code), 
but the gist of it is this:

- When we push updates to the `tutorial` directory, we run `bluehawk check` to
make sure there are no Bluehawk errors
- Then, we use Bluehawk to copy code examples for each `state` to git branches
in artifact repositories. The git branch names match the `states` in our code 
examples.

This lets us update tutorial code in a single place - the `tutorial` directory
in our documentation repository. Then, using Bluehawk, we generate updated 
code examples for our documentation. This CI also copies the updated code to 
our tutorial repositories that developers can clone and run on their machines.

All of this reduces the need to manually update code in multiple places - 
which makes maintenance faster, and reduces the need to remember to copy
code to all of the places.
