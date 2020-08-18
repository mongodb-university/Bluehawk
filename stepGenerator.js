const fileHandler = require("./fileHandler");
const output = require("./output");
const constants = require("./constants");
const fs = require("fs");

let inStep = false;
let currentStep = "A. ";

var fullFile = [];
var codeBlocks = [];

async function run(stages, fileType) {
  console.log("step-file start", fileHandler.fileArray);
  fileHandler.fileArray.forEach(async (file) => {
    if (file.source) {
      stages.forEach(async (stage) => {
        buildStepFile(file, stage, fileType);
      });
    }
  });
}

async function buildStepFile(file, stage, fileType) {
  fs.writeFile(file.step, "", function (err) {
    if (err) output.error(err);
  });

  fullFile = fs.readFileSync(file.source, "utf8").split("\n");
  await getCodeBlocks();

  var line = true;
  while (fullFile.length > 0) {
    line = fullFile.shift();
    if (!inStep) {
      await checkForStart(line, file);
    } else {
      await checkForNextCommandOrWrite(line, file, fileType);
    }
  }
}

async function getCodeBlocks() {
  let starter = false;
  let final = false;
  let codeBlockProps = [];

  for (const [index, codeLine] of fullFile.entries()) {
    let id;
    let counter = index + 1;
    let nextCodeLine = fullFile[counter];
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
          nextCodeLine = fullFile[counter];
        }
        counter++;
      } else {
        id = codeLine.substring(":code-block-start:".length + 2).trimStart();
      }

      let starterCodeLines = [];
      let finalCodeLines = [];

      while (nextCodeLine && nextCodeLine.indexOf(":code-block-end:") == -1) {
        nextCodeLine = fullFile[counter];

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
      codeBlocks.push({
        id: id,
        startCode: starterCodeLines,
        endCode: finalCodeLines,
        props: codeBlockProps,
      });
    }
  }
}

async function checkForStart(line, file) {
  if (line.indexOf(":step-start:") > -1) {
    inStep = true;
    if (line.indexOf("{") > -1) {
      var propObj = await buildObjectFromPropsString(line);
      var step = ".. " + propObj.id + "\n" + currentStep + propObj.title;
      fs.appendFileSync(file.step, step + "\n\n");
    } else {
      //default property
      var title = line.substring(":step-start:".length).trimStart();
      var step = currentStep + title;
      fs.appendFileSync(file.step, step + "\n\n");
    }
  }
}

async function checkForNextCommandOrWrite(line, file, fileType) {
  if (line.indexOf(":step-end:") > -1) {
    inStep = false;
    currentStep = "#. ";
    fs.appendFileSync(file.step, "\n\n");
    return;
  }
  if (line.indexOf(":include-code-block:") > -1) {
    var props = await buildObjectFromPropsString(line);
    //open final code file that contains the block
    if (props && props.id) {
      if (props.id.indexOf(".") > -1) {
        //we need to find a foreign file!
      } else {
        let codeBlock = codeBlocks.find((e) => e.id == props.id);
        var outputCode;
        if (codeBlock) {
          if (codeBlock["props"]) {
            outputCode = ".. code-block:: " + fileType + "\n\t";
            constants.commands[":code-block-start:"].forEach((property) => {
              if (codeBlock["props"][property]) {
                outputCode = outputCode.concat(
                  property,
                  " : ",
                  codeBlock["props"][property] + "\n\t"
                );
              }
            });
            outputCode = outputCode.concat("\n\t");
          } else outputCode = ".. code-block:: " + fileType + "\n\n\t";
          if (props.state == "start") {
            outputCode = outputCode.concat(codeBlock.startCode.join("\n\t"));
          } else if (props.state == "final") {
            outputCode = outputCode.concat(codeBlock.endCode.join("\n\t"));
          }
          outputCode = outputCode.concat("\n\n");
          fs.appendFileSync(file.step, outputCode);
        }
      }
    }
    return;
  }

  fs.appendFileSync(file.step, line + "\n");
}

async function buildObjectFromPropsString(current) {
  if (current.indexOf("}") > -1) {
    //the props object is all on one line!
    var sub = current.substring(":include-code-block:".length);
    return JSON.parse(sub);
  } else {
    var propObj = "{";
    let line = fullFile.shift();
    if (!line) reject();
    while (line.indexOf("}") == -1) {
      propObj = propObj.concat(line);
      line = fullFile.shift();
    }
    propObj = propObj.concat("}");
    return JSON.parse(propObj);
  }
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
