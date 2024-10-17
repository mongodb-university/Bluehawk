// :snippet-start: cpp-test
auto something = SomeClass::someProperty;
// :snippet-end:

// :snippet-start: failing-cpp-test
auto something = SomeClass::state::something;
// :snippet-end:

// :snippet-start: multi-line-block-comment
/*
 * Here's some block comment on multiple lines.
 */
auto something = SomeClass::state::something;
// :snippet-end:

// :snippet-start: single-line-block-comment
/* Here's some block comment on a single line */
auto something = SomeClass::state::something;
// :snippet-end: