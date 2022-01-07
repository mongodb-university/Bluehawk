export function isError(x: unknown): x is Error {
  return x instanceof Error;
}

export function isString(x: unknown): x is string {
  return typeof x === "string";
}
