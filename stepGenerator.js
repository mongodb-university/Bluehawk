const builder = require("./builder");
const output = require("./output");
const constants = require("./constants");
const fs = require("fs");

let inStep = false;
let currentStep = "A. ";
var fullOutput = [];
var source=[];
var codeBlocks=[];

async function buildStepFile(file, fileType, fullFile, code) {
  source = fullFile;
  codeBlocks = code;

  return new Promise(async (resolve, reject) => {
    fs.writeFile(file.step, "", function (err) {
      if (err) output.error(err);
    });

    var line = true;
    while (source.length > 0) {
      line = source.shift();
      if (!inStep) {
        await checkForStart(line, source);
      } else {
        await checkForNextCommandOrWrite(line, fileType);
      }
    }
    resolve(fullOutput);
  });
}

async function checkForStart(line) {
  return new Promise(async (resolve, reject) => {
    if (line.indexOf(":step-start:") > -1) {
      inStep = true;
      if (line.indexOf("{") > -1) {
        var propObj = await buildObjectFromPropsString(line);
        var step = ".. " + propObj.id + "\n" + currentStep + propObj.title;
        fullOutput.push(step + "\n\n");
      } else {
        //default property
        var title = line.substring(":step-start:".length).trimStart();
        var step = currentStep + title;
        fullOutput.push(step + "\n\n");
      }
    }
    resolve();
  });
}

async function checkForNextCommandOrWrite(line, fileType) {
  if (line.indexOf(":step-end:") > -1) {
    inStep = false;
    currentStep = "#. ";
    fullOutput.push("\n\n");
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
          outputCode = ".. code-block:: " + fileType + "\n\t";
          constants.commands[":include-code-block:"].forEach((property) => {
            if (props[property]) {
              outputCode = outputCode.concat(
                property,
                " : ",
                props[property] + "\n\t"
              );
            }
          });
          outputCode = outputCode.concat("\n\t");
          if (props.state == "start") {
            outputCode = outputCode.concat(codeBlock.startCode.join("\n\t"));
          } else if (props.state == "final") {
            outputCode = outputCode.concat(codeBlock.endCode.join("\n\t"));
          }
          outputCode = outputCode.concat("\n\n");
          fullOutput.push(outputCode);
        }
      }
    }
    return;
  }
  fullOutput.push(line + "\n");
}

async function buildObjectFromPropsString(current) {
  if (current.indexOf("}") > -1) {
    //the props object is all on one line!
    var sub = current.substring(":include-code-block:".length);
    return JSON.parse(sub);
  } else {
    var propObj = "{";
    let line = source.shift();
    if (!line) reject();
    while (line.indexOf("}") == -1) {
      propObj = propObj.concat(line);
      line = source.shift();
    }
    propObj = propObj.concat("}");
    return JSON.parse(propObj);
  }
}

async function safeBuildObjectFromPropsString(command, index) {
  if (source[index].indexOf("}") > -1) {
    var propsString = source[index].split(",");
    return JSON.parse(propsString);
  } else {
    var propObj = "{";
    while (source[index].indexOf("}") == -1) {
      propObj = propObj.concat(source[index]);
      index++;
    }
    propObj = propObj.concat("}");
    return JSON.parse(propObj);
  }
}

exports.buildStepFile = buildStepFile;
