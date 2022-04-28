#!/bin/bash -e

cd "$(dirname "$0")"

rm -rf output
mkdir output

# These are meant to cause errors, so don't fail out the script.
set +e

for LOGLEVEL in 0 1 2 3
do
  # - Ignore the actual output, just look at the logs
  # - Use a state that is not actually found to trigger the state not found warning
  # - Set the log level to each possible level
  # - Redirect stderr to stdout
  # - Pipe to sed, delete any instances of your computer name
  # - Pipe to a file
  $BLUEHAWK snip -o output/ignoreThis --state notfound --logLevel $LOGLEVEL input 2>&1 | sed -e "s!$(pwd)!path/to/project!g" > output/logLevel$LOGLEVEL
done
set -e
