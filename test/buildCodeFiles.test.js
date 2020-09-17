const { buildCodeFiles } = require("../codeGenerator");
const { expect } = require("chai");

describe("buildCodeFiles", () => {
  it("should return code files", () => {
    const source = "this bluehawk source has no annotation";
    const files = buildCodeFiles(source, "js");
    expect(files).to.deep.equal({
      start: "this bluehawk source has no annotation",
      final: "this bluehawk source has no annotation",
    });
  });

  it("should hide directives", () => {
    const source = `// :code-block-start: hide-me
this is all that should remain
// :code-block-end:`;
    const files = buildCodeFiles(source, "js");
    expect(files).to.deep.equal({
      start: `this is all that should remain`,
      final: `this is all that should remain`,
    });
  });

  it("should understand hide and replace-with directives", () => {
    const source = `// :code-block-start: hide-me
// :hide-start:
this is all that should remain in final
// :replace-with: 
//this is all that should remain in start (note stripped comment)
// :hide-end:
// :code-block-end:`;
    const files = buildCodeFiles(source, "js");
    expect(files).to.deep.equal({
      start: `this is all that should remain in start (note stripped comment)`,
      final: `this is all that should remain in final`,
    });
  });

  it("should dedent lines", () => {
    const source = `
          // :code-block-start: dedent-me
          this should be flush with the left column
          // :hide-start:
          this should be flush with the left column in final
          // :replace-with:
          this should be flush with the left column in start
          // :hide-end:
          // :code-block-end:`;
    const files = buildCodeFiles(source, "js");
    expect(files).to.deep.equal({
      start: `
this should be flush with the left column
this should be flush with the left column in start
`,
      final: `
this should be flush with the left column
this should be flush with the left column in final
`,
    });
  });
});
