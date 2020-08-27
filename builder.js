const fileHandler = require("./fileHandler");
const stepper = require("./stepGenerator");
const coder = require("./codeGenerator");
const output = require("./output");
const fs = require("fs");
const { white } = require("chalk");

let fullFile = [];
let codeBlocks = [];
let fileType;

async function run(stages, type) {
  fileType = type;
  for (f = 0; f < fileHandler.fileArray.length; f++) {
    let file = fileHandler.fileArray[f];
    if (file.source) {
      // one step file for each file
      fullFile = fs.readFileSync(file.source, "utf8").split("\n");
      codeBlocks = await getCodeBlocks(fullFile, file);
      let result = await stepper.buildStepFile(
        file,
        fileType,
        fullFile,
        codeBlocks
      );
      fs.appendFileSync(file.step, result.join(""));

      let source = fs.readFileSync(file.source, "utf8").split("\n");
      let codeFile = await coder.buildCodeFiles(source, fileType);
      fs.writeFileSync(file.start, codeFile["start"].join(""));
      fs.writeFileSync(file.final, codeFile["final"].join(""));
    }
  }
}

async function getCodeBlocks(input, fileObject) {
  let result = [];

  return new Promise(async (resolve, reject) => {
    let starter = false;
    let final = false;
    let codeBlockProps = [];

    for (const [index, codeLine] of input.entries()) {
      let id;
      let counter = index + 1;
      let nextCodeLine = input[counter];

      if (codeLine.indexOf(":code-block-start:") > -1) {
        let starterCodeLines = [];
        let finalCodeLines = [];

        //build code block and store for future lookup

        if (codeLine.indexOf("{") > -1) {
          //we have a property object
          codeBlockProps = await safeBuildObjectFromPropsString(index + 1);
          id = codeBlockProps.id;

          while (nextCodeLine.indexOf("}") == -1) {
            counter++;
            nextCodeLine = await input[counter];
          }
          counter++;
        } else {
          let foo = codeLine.replace(/ /g, "");
          let matchAll = Array.from(foo.matchAll(":"));
          id = foo
            .substring(matchAll[matchAll.length - 1].index + 1)
            .trim()
            .replace("*/", "");
        }

        while (nextCodeLine && nextCodeLine.indexOf(":code-block-end:") == -1) {
          nextCodeLine = input[counter];

          if (nextCodeLine.indexOf(":hide-start:") > -1) {
            final = true;
            starter = false;
            counter++;
            continue;
          } else if (nextCodeLine.indexOf(":hide-end:") > -1) {
            starter = true;
            final = true;
            counter++;
            continue;
          } else if (nextCodeLine.indexOf(":replace-with:") > -1) {
            final = false;
            starter = true;
            counter++;
            continue;
          } else if (nextCodeLine.indexOf(":code-block-end:") > -1) {
            saveCodeBlock(id, starterCodeLines, fileObject, "start");
            saveCodeBlock(id, finalCodeLines, fileObject, "final");
            counter++;
            continue;
          }

          if (starter) {
            starterCodeLines.push(nextCodeLine);
          }
          if (final) {
            finalCodeLines.push(nextCodeLine);
          }

          counter++;
        }

        result.push({
          id: id,
          startCode: starterCodeLines,
          endCode: finalCodeLines,
          props: codeBlockProps,
        });
      } // end code block
    }
    resolve(result);
  });
}

async function safeBuildObjectFromPropsString(index) {
  if (fullFile[index].indexOf("}") > -1) {
    const propsString = fullFile[index].split(",");
    return JSON.parse(propsString);
  } else {
    const propObj = "{";
    while (fullFile[index].indexOf("}") == -1) {
      propObj = propObj.concat(fullFile[index]);
      index++;
    }
    propObj = propObj.concat("}");
    return JSON.parse(propObj);
  }
}

function saveCodeBlock(id, source, fileObject, stage) {
  let whitespaceToRemove = 100000;
  const reg = /[^\s]/g;
  for (l = 0; l < source.length; l++) {
    if (source[l].search(reg) < whitespaceToRemove) {
      whitespaceToRemove = source[l].search(reg);
    }
  }
  for (l = 0; l < source.length; l++) {
    source[l] = source[l].substring(whitespaceToRemove);
  }

  const filename = fileObject["codeBlock"][stage] + "." + id + "." + fileType;
  fs.writeFile(filename, source.join("\n"), (err) => {
    if (err) {
      output.error(err);
    }
  });
}

exports.run = run;
