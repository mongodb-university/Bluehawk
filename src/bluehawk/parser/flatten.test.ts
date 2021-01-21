import { flatten } from "./flatten";

describe("flatten", () => {
  interface Node {
    value: string;
    children: Node[];
  }
  it("flattens a hierarchical structure", () => {
    const root: Node = {
      value: "a",
      children: [
        {
          value: "b",
          children: [
            {
              value: "c",
              children: [],
            },
          ],
        },
        {
          value: "d",
          children: [],
        },
      ],
    };
    const flattened = flatten(root);
    expect(flattened.map((node) => node.value)).toStrictEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  it("handles empty structures", () => {
    const root: Node = {
      value: "a",
      children: [],
    };
    const flattened = flatten(root);
    expect(flattened.map((node) => node.value)).toStrictEqual(["a"]);
  });
});
