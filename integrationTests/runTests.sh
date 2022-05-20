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
  CHECKSUM_RESULT=`find . -type f ! -name ".DS_Store" -exec shasum {} + | sort | shasum`
  popd > /dev/null
}

# Select tests
if [ -z "$1" ]
then
  TESTS=`find . -name "test.sh"`
else
  TESTS="$1"/test.sh
fi

# Run tests
for TEST in $TESTS
do
  TEST_DIR="$(dirname "$TEST")"
  "$TEST"
  checksum ./"$TEST_DIR"/expected
  EXPECTED_CHECKSUM=$CHECKSUM_RESULT
  checksum ./"$TEST_DIR"/output
  OUTPUT_CHECKSUM=$CHECKSUM_RESULT
  if [ "$EXPECTED_CHECKSUM" != "$OUTPUT_CHECKSUM" ]
  then
    echo "Test failed: $TEST_DIR"
    echo "Compare ./$TEST_DIR/expected and ./$TEST_DIR/output to debug."
    exit 1
  else
    echo "✅ Test passed: $TEST_DIR"
  fi
done
