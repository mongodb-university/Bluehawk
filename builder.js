const coder = require("./codeGenerator");
const stepper = require("./stepGenerator");
const { getCodeBlocks } = require("./getCodeBlocks");
const output = require("./output");
const fs = require("fs");

// Make a function to handle emitted code blocks and save them for the given
// fileObject and type
function makeSaveCodeBlockFunction(fileObject, fileType) {
  return ({ id, source, stage }) => {
    let whitespaceToRemove = 1000;
    const reg = /[^\s]/g;
    for (let l = 0; l < source.length; l++) {
      if (source[l].search(reg) < whitespaceToRemove) {
        whitespaceToRemove = source[l].search(reg);
      }
    }
    for (let l = 0; l < source.length; l++) {
      source[l] = source[l].substring(whitespaceToRemove);
    }

    const filename = fileObject["codeBlock"][stage] + "." + id + "." + fileType;
    fs.writeFile(filename, source.join("\n"), (err) => {
      if (err) {
        output.error(err);
      }
    });
  };
}

async function run(fileArray, type) {
  let fullFile = [];
  let fileType;
  let codeFile;
  let codeBlocks = [];

  fileType = type;
  for (let f = 0; f < fileArray.length; f++) {
    let file = fileArray[f];
    if (file.source) {
      const saveCodeBlock = makeSaveCodeBlockFunction(file, fileType);
      // one step file for each file
      fullFile = fs.readFileSync(file.source, "utf8").split("\n");
      try {
        codeBlocks = await getCodeBlocks({
          input: fullFile,
          emitCodeBlock: saveCodeBlock,
        });
      } catch (e) {
        console.error(e);
      }

      fs.writeFile(file.step, "", function (err) {
        if (err) output.error(err);
      });

      output.info("Building step file(s) from", file.source);

      let result = stepper.buildStepFile(fileType, fullFile, codeBlocks);

      //console.log(result.join("").split('\n'))

      fs.appendFileSync(file.step, result.join(""));

      let source = fs.readFileSync(file.source, "utf8");
      output.info("Building code file(s) from", file.source);
      codeFile = coder.buildCodeFiles(source, fileType);
      fs.writeFileSync(file.start, codeFile["start"]);
      fs.writeFileSync(file.final, codeFile["final"]);
    }
  }
}

exports.run = run;
