import { AnyCommandNode } from "./CommandNode";
import { Document } from "../Document";
import { BluehawkError } from "../BluehawkError";
import { LanguageSpecification } from "./LanguageSpecification";

export interface ParseResult {
  errors: BluehawkError[];
  commandNodes: AnyCommandNode[];
  source: Document;
  languageSpecification?: LanguageSpecification;
}
