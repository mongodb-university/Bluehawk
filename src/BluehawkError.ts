import { Location } from "./Location";

export interface BluehawkError {
  component: "lexer" | "parser" | "visitor" | "validator" | "processor";
  message: string;
  location: Location;
}
