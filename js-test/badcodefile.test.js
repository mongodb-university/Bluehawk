const assert = require("assert");
const fs = require("fs");
const expectedCodeFile = require("./expected/badcodefile");
const output = require("../build/output");
const path = require("path");
const dirPath = path.join(__dirname, "/output");

describe("Badcode file tests", function () {
  it("Should handle bad code files gracefully", function (done) {
    let startResult = fs.readFileSync(
      dirPath + "/code/start/badcodefile.js",
      "utf8"
    );
    let finalResult = fs.readFileSync(
      dirPath + "/code/final/badcodefile.js",
      "utf8"
    );

    try {
      assert.equal(
        startResult.length,
        expectedCodeFile.output["start"].length,
        "The 'start' output is not the expected length"
      );

      assert.equal(
        finalResult.length,
        expectedCodeFile.output["final"].length,
        "The 'final' output is not the expected length"
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
