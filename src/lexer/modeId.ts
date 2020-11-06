// Global modeId incremented on each call to makeModeId().
let modeId = 0;

// Allow make...Tokens() invocations to share a mode ID for the tokens they
// create so that the lexer can put them into their own modes dynamically.
export function makeModeId(): string {
  return `__mode${++modeId}__`;
}

// Retrieve a mode ID from the given token name. The token must have been
// created with the name format `${modeId}TokenName`.
export function getModeIdFromTokenName(name: string): string | undefined {
  const result = /^(__mode[0-9]+__)/.exec(name);
  return result && result[1];
}
