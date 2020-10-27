// Contributors may provide comment patterns for arbitrary languages, e.g. "//",
// "/*", "#", ".. ", etc.
export interface CommentPatterns {
  lineCommentPattern?: RegExp;
  blockCommentStartPattern?: RegExp;
  blockCommentEndPattern?: RegExp;
  canNestBlockComments: boolean;
}
