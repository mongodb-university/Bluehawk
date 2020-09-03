const assert = require('assert');
const stepper = require("../stepGenerator");
const expectedStepFiles = require('./expected/stepfile');

describe('Step file tests', function() {
   it('should load step files and verify each', async function() {
      
    let result = await stepper.buildStepFile("js", expectedStepFiles.input, expectedStepFiles.codeBlocks)
    result = result.join('').split('\n');

    assert.equal(result.length, expectedStepFiles.output.length, 
        "The output is not the expected length");

    for (l=0;l<result.length;l++){
        assert.equal(result[l].trim(), expectedStepFiles.output[l].trim(), 
            "line " + l + ": " + result[l]);
    }

    assert.equal(index.warningsCount, 0, "I should have no warnings")
    assert.equal(index.errorsCount, 1, "I should have no errors")
   })
})