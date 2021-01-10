// Flattens a hierarchical structure
export function flatten<T extends { children?: T[] }>(node: T): T[] {
  return (node.children ?? []).reduce((acc, cur) => [...acc, ...flatten(cur)], [
    node,
  ]);
}
