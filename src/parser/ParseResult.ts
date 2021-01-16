import { CommandNode } from "./CommandNode";
import { Document } from "../Document";
import { BluehawkError } from "../BluehawkError";

export class ParseResult {
  errors: BluehawkError[];
  commands: CommandNode[];
  source: Document;
}
