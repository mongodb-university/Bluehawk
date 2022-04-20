#!/bin/bash -e

# Local build setup
pushd "$(dirname "$0")" > /dev/null
pushd .. > /dev/null
PROJECT_ROOT="`pwd`"
npm install
npm run build
popd > /dev/null
export BLUEHAWK="node $PROJECT_ROOT/build/src/main"

function checksum() {
  pushd "$1" > /dev/null
  CHECKSUM_RESULT=`find . -type f -exec md5 {} + | sort | md5`
  popd > /dev/null
}

# Run tests
TESTS=("snip")

for TEST in $TESTS
do
  ./"$TEST"/test.sh
  checksum ./"$TEST"/expected
  EXPECTED_CHECKSUM=$CHECKSUM_RESULT
  checksum ./"$TEST"/output
  OUTPUT_CHECKSUM=$CHECKSUM_RESULT
  if [ "$EXPECTED_CHECKSUM" != "$OUTPUT_CHECKSUM" ]
  then
    echo "Test failed: $TEST"
    echo "Compare ./$TEST/expected and ./$TEST/output to debug."
    exit 1
  else
    echo "✅ Test passed: $TEST"
  fi
done
