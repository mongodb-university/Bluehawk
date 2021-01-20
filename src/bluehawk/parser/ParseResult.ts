import { CommandNode } from "./CommandNode";
import { Document } from "../Document";
import { BluehawkError } from "../BluehawkError";

export interface ParseResult {
  errors: BluehawkError[];
  commandNodes: CommandNode[];
  source: Document;
}
