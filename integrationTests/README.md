# CLI Integration Tests

These tests run the CLI and ensure that a CLI command on an "input" directory
results in an "output" directory that perfectly matches the "expected"
directory.

More thorough testing of actions should be done in unit tests. This is just
another layer of assurance that the CLI is not broken when you make changes.

## Run All Tests

To run the tests:

```sh
./runTests.sh
```

This does the following:

- Builds the latest Bluehawk executable
- Runs all "test.sh" files found in subdirectories
- Checksum-compares the contents of each test's "output" and "expected" directories

## Run a Specific Test

The "runTests.sh" script optionally takes one argument. This can be the
directory name that contains a test.sh file.

The following example will only run the "snip" test:

```sh
./runTests.sh snip
```

## Add a Test

To create a test, copy an existing test as a template:

```sh
cp -R ./snip myNewTest
```

Within your new test directory, create input files (if needed) in a directory
called "input".

Create the expected result file(s) and place them in a directory called
"expected".

Update the command in "myNewTest/test.sh" to the command you want to test. The
`$BLUEHAWK` environment variable will be set to the current development build.

Ensure the output of your command is sent to a directory called "output".

Use the parent directory's "runTests.sh" script to run your test.
