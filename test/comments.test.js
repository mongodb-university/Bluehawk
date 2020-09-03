const assert = require("assert");
const filer = require("../fileHandler");
const expected = require("./expected/comments");
const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "/output");
let startResult;
let finalResult;

describe("Comment file tests", async function (done) {
  it("Should verify the 'start' code state", async function (done) {
    startResult = fs.readFileSync(dirPath + "/code/start/comments.js", "utf8");
    finalResult = fs.readFileSync(dirPath + "/code/final/comments.js", "utf8");

    startResult = startResult.split("\n");
    finalResult = finalResult.split("\n");

    startResult.pop();
    finalResult.pop();
    try {
      assert.equal(
        startResult.length,
        expected.output["start"].length,
        "The output is not the expected length"
      );

      for (l = 0; l < startResult.length; l++) {
        assert.equal(
          startResult[l].trim(),
          expected.output["start"][l].trim(),
          "ERROR in 'start' code at line " + (l + 1) + ": " + startResult[l]
        );
      }
    } catch (error) {
      return done(error);
    }
    done();
  });
  it("Should verify the 'final' code state", async function (done) {
    try {
      assert.equal(
        finalResult.length,
        expected.output["final"].length,
        "The output is not the expected length"
      );

      for (l = 0; l < finalResult.length; l++) {
        assert.equal(
          finalResult[l].trim(),
          expected.output["final"][l].trim(),
          "ERROR in 'final' code at line " + (l + 1) + ": " + finalResult[l]
        );
      }
    } catch (error) {
      return done(error);
    }
    done();
  });
});
