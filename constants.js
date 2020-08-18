let comments = {
   js: {start_block: ["/*"], end_block: ["*/"], line: ["//"]},
}

let commands = {
   ":hide-start:" : ["id","title","parent","next-step"],
   ":hide-end:":{},
   ":replace-with:":{},
   ":step-start:":{},
   ":step-end:":{},
   ":include-code-block:":{},
   ":code-block-start:":["emphasize-lines","line-numbers"],
   ":code-block-end:": {}
}

exports.comments = comments;
exports.commands = commands;