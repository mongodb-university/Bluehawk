const assert = require("assert");
const fs = require("fs");
const expectedCodeFile = require("./expected/firstBlockNotHidden");
const output = require("../build/output");
const path = require("path");
const dirPath = path.join(__dirname, "/output");

describe("First code block tests", function () {
  it("Should not hide first code block", function (done) {
    let startResult = fs.readFileSync(
      dirPath +
        "/code/start/firstBlockNotHidden.codeblock.i-should-not-be-hidden.js",
      "utf8"
    );

    startResult = startResult.split("\n");

    try {
      assert.equal(
        startResult.length,
        expectedCodeFile.output["start"].length,
        "The 'start' output is not the expected length"
      );

      for (let l = 0; l < startResult.length; l++) {
        assert.equal(
          startResult[l].trim(),
          expectedCodeFile.output["start"][l].trim(),
          "ERROR in 'start' code at line " + (l + 1) + ": " + startResult[l]
        );
      }

      assert.equal(
        output.warningsList.length,
        1,
        "The bad code should have 1 warning"
      );
      assert.equal(
        output.errorsList.length,
        3,
        "The bad code should have 3 errors"
      );
    } catch (error) {
      return done(error);
    }
    done();
  });
});
