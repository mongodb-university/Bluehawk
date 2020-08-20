const fileHandler = require("./fileHandler");
const stepper = require("./stepGenerator");
const coder = require("./codeGenerator");
const output = require("./output");
const fs = require("fs");

var fullFile = [];
var codeBlocks = [];

async function run(stages, fileType) {
  console.log("builder start", fileHandler.fileArray);
  for (f = 0; f < fileHandler.fileArray.length; f++) {
    let file = fileHandler.fileArray[f];
    if (file.source) {
      // one step file for each file
      fullFile = fs.readFileSync(file.source, "utf8").split("\n");
      codeBlocks = await getCodeBlocks(fullFile);
      let result = await stepper.buildStepFile(
        file,
        fileType,
        fullFile,
        codeBlocks
      );
      fs.appendFileSync(file.step, result.join(""));

      let source = fs.readFileSync(file.source, "utf8").split("\n");
      let codeFile = await coder.buildCodeFiles(source, fileType);
      //output.result("***", file.source, JSON.stringify(codeFile))
      fs.writeFileSync(file.start, codeFile["start"].join(""));
      fs.writeFileSync(file.final, codeFile["final"].join(""));
    }
  }
}

async function getCodeBlocks(input) {
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
    var propsString = fullFile[index].split(",");
    return JSON.parse(propsString);
  } else {
    var propObj = "{";
    while (fullFile[index].indexOf("}") == -1) {
      propObj = propObj.concat(fullFile[index]);
      index++;
    }
    propObj = propObj.concat("}");
    return JSON.parse(propObj);
  }
}

exports.run = run;
