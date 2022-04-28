import { AnyTagNode } from "./TagNode";
import { Document } from "../Document";
import { BluehawkError } from "../BluehawkError";
import { LanguageSpecification } from "./LanguageSpecification";

export interface ParseResult {
  errors: BluehawkError[];
  tagNodes: AnyTagNode[];
  input: Document;
  languageSpecification?: LanguageSpecification;
}
