import { CstNode, CstParser } from "chevrotain";
import { CommentPatterns } from "../lexer/CommentPatterns";
import { makeRootMode } from "../lexer/makeRootMode";

type Rule = (idx: number) => CstNode;

export class RootParser extends CstParser {
  selectClause?: Rule;
  fromClause?: Rule;
  whereClause?: Rule;

  constructor(commentPatterns: CommentPatterns) {
    super(makeRootMode(commentPatterns));

    const $ = this;

    $.RULE("selectStatement", () => {
      $.SUBRULE($.selectClause);
      $.SUBRULE($.fromClause);
      $.OPTION(() => {
        $.SUBRULE($.whereClause);
      });
    });
    this.performSelfAnalysis();
  }
}
