#!/bin/bash -e

cd "$(dirname "$0")"

rm -rf output
mkdir output

$BLUEHAWK snip -d ./output input
