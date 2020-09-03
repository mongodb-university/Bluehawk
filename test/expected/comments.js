module.exports.output = 
 {
   start: [
      '// comment-testing',
      '// I am in all outputs',
      'let iamcode = true',
      'I am code in a code block before the hide',
      '// I am a comment in the replace-with',
      'I am still in the code-block after the hide-end',
      '/*',
      'I am code in a block comment',
      '//I am a comment within a block comment. Weird, but not a warning.',
      'I am code in another codeblock',
      '// I am a comment in that codeblock',
      '// I am a comment in the replace-with',
      '*/'
   ],
   final: [
      '// comment-testing',
      '// I am in all outputs',
      'let iamcode = true',
      'I am code in a code block before the hide',
      '// I am a comment within the hide',
      'I am still in the code-block after the hide-end',
      '/*',
      'I am code in a block comment',
      '//I am a comment within a block comment. Weird, but not a warning.',
      'I am code in another codeblock',
      '// I am a comment in that codeblock',
      'I am code within the hide',
      '*/'
   ]
  }