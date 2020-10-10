const assert = require("assert");
const expected = require("./expected/stepfilewithcode");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "/output");

let stepResult;

describe("Stepfile tests", async function () {
  it("Verifies complete step file", async function (done) {
    stepResult = fs.readFileSync(
      dirPath + "/steps/stepfilewithcode.step.rst",
      "utf8"
    );

    stepResult = stepResult.split("\n");

    try {
      assert.equal(
        stepResult.length,
        expected.output.length,
        "The output is not the expected length"
      );

      for (let l = 0; l < stepResult.length; l++) {
        assert.equal(
          stepResult[l],
          expected.output[l],
          "ERROR in step code at line " + (l + 1) + ": " + stepResult[l]
        );
      }
    } catch (error) {
      return done(error);
    }
    done();
  });

  it("Verifies each of the code-block files", async function (done) {
    var start1 = fs.readFileSync(
      dirPath + "/code/start/stepfilewithcode.codeblock.foo.js",
      "utf8"
    );
    var start2 = fs.readFileSync(
      dirPath + "/code/start/stepfilewithcode.codeblock.realmAppId.js",
      "utf8"
    );
    var final1 = fs.readFileSync(
      dirPath + "/code/final/stepfilewithcode.codeblock.foo.js",
      "utf8"
    );
    var final2 = fs.readFileSync(
      dirPath + "/code/final/stepfilewithcode.codeblock.realmAppId.js",
      "utf8"
    );

    let files = [start1, start2, final1, final2];
    try {
      for (let f = 0; f < files.length; f++) {
        let target = expected.codeBlocks[f];
        let result = files[f].split("\n");
        assert.equal(
          result.length,
          target.length,
          "The output is not the expected length"
        );

        for (let l = 0; l < files[f].length; l++) {
          assert.equal(
            result[l],
            target[l],
            "ERROR in step code at line " + (l + 1) + ": " + result[l]
          );
        }
      }
    } catch (error) {
      return done(error);
    }
    done();
  });
});
