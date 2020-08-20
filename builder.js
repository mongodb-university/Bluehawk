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
      let result = await stepper.buildStepFile(file, fileType, fullFile, codeBlocks);
      fs.appendFileSync(file.step, result.join(""));
     
      for (s = 0; s < stages.length; s++) {
         // different code file for each stage
         let stage = stages[s];
         fs.writeFile(file[stage], "", function (err) {
            if (err) output.error(err);
          });
         fullFile = fs.readFileSync(file.source, "utf8").split("\n");
         let result = await coder.buildFileForStage(stage, codeBlocks, fileType);
         console.log(result);
         fs.appendFileSync(file[stage], result.join(""));
      }
    }
  }
}

async function getCodeBlocks(input) {
   var result = [];
   return new Promise(async (resolve, reject) => {
      let starter = false;
      let final = false;
      let codeBlockProps = [];

      for (const [index, codeLine] of input.entries()) {
         let id;
         let counter = index + 1;
         let nextCodeLine = input[counter];
         if (codeLine.indexOf(":code-block-start:") > -1) {
         //build code block and store for future lookup
         if (codeLine.indexOf("{") > -1) {
            //we have a property object
            codeBlockProps = await safeBuildObjectFromPropsString(
               ":code-block-start:",
               index + 1
            );
            id = codeBlockProps.id;

            while (nextCodeLine.indexOf("}") == -1) {
               counter++;
               nextCodeLine = await input[counter];
            }
            counter++;
         } else {
            id = codeLine.substring(":code-block-start:".length + 2).trimStart();
         }

         let starterCodeLines = [];
         let finalCodeLines = [];

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

            //TODO: this could be expanded to allow multiple states
            // rather than just start and final. Not MVP?
         }
         result.push({
            id: id,
            startCode: starterCodeLines,
            endCode: finalCodeLines,
            props: codeBlockProps,
         });
         }
      }
      console.log('done building code blocks', result)
      resolve(result);
   });
}

async function safeBuildObjectFromPropsString(command, index) {
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
