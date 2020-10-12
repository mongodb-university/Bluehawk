// comment-testing
// I am in all outputs
let iamcode = true
// :code-block-start:foo1
I am code in a code block before the hide
// :hide-start:
// I am a comment within the hide
// :replace-with:
// // 1 I am a comment in the replace-with
// :hide-end:
I am still in the code-block after the hide-end
// :code-block-end:
/*
I am code in a block comment
//I am a comment within a block comment. Weird, but not a warning.
:code-block-start:foo2
I am code in another codeblock
// I am a comment in that codeblock
:hide-start:
I am code within the hide
:replace-with:
// 2 I am a comment in the replace-with
:hide-end:
:code-block-end:
*/
