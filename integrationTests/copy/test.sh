#!/bin/bash -e

cd "$(dirname "$0")"

rm -rf output
mkdir output

$BLUEHAWK copy --state state1 -d ./output/state1 input
$BLUEHAWK copy --state state2 -d ./output/state2 input
