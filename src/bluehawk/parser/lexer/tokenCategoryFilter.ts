import { TokenType } from "chevrotain";

// Returns the subset of given tokens that are in at least one of the given
// categories.
export function tokenCategoryFilter(
  tokens: TokenType[],
  categories: TokenType[]
): TokenType[] {
  return tokens.filter(
    (token) =>
      token.CATEGORIES?.find((category) => categories.includes(category)) !==
      undefined
  );
}
