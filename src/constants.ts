export const comments = {
  cs: { start_block: ["/*"], end_block: ["*/"], line: ["//"] },
  c: { start_block: ["/*"], end_block: ["*/"], line: ["//"] },
  js: { start_block: ["/*"], end_block: ["*/"], line: ["//"] },
  swift: { start_block: ["/*"], end_block: ["*/"], line: ["//"] },
  kt: { start_block: ["/*"], end_block: ["*/"], line: ["//"] },
  java: { start_block: ["/*"], end_block: ["*/"], line: ["//"] },
};

export const commands = {
  ":hide-start:": ["id", "title", "parent", "next-step"],
  ":hide-end:": {},
  ":replace-with:": {},
  ":step-start:": {},
  ":step-end:": {},
  ":include-code-block:": ["emphasize_lines", "line_numbers"],
  ":code-block-start:": {},
  ":code-block-end:": {},
};
