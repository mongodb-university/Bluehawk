const output = require("./output");
const constants = require("./constants");

let inStep = false;
let currentStep = "A. ";
let fullOutput = [];
let source = [];
let codeBlocks = [];
let lineNumber;
let fullLength;

async function buildStepFile(fileType, fullFile, code) {
  fullLength = fullFile.length;
  source = fullFile;
  codeBlocks = code;

  return new Promise(async (resolve, reject) => {
    let line = true;
    while (source.length > 0) {
      line = source.shift();
      lineNumber = fullLength - source.length;
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
        buildObjectFromPropsString(line, true)
          .then((propObj) => {
            const step =
              ".. " + propObj.id + "\n" + currentStep + propObj.title;
            fullOutput.push(step + "\n\n");
          })
          .catch((err) => {
            reject();
          });
      } else {
        //default property
        const title = line.substring(":step-start:".length).trimStart();
        const step = currentStep + title;
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
    await buildObjectFromPropsString(line, false).then(async (props) => {
      if (props && props.id) {
        if (props.id.indexOf(".") > -1) {
          //TODO: link to a foreign file
        } else {
          let codeBlock = codeBlocks.find((e) => e.id == props.id);
          let outputCode;
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
    });
    return;
  }
  fullOutput.push(line + "\n");
}

async function buildObjectFromPropsString(current, isStepProps) {
  return new Promise(async (resolve, reject) => {
    if (current.indexOf("}") > -1) {
      //the props object is all on one line
      const sub = current.substring(":include-code-block:".length);
      return resolve(JSON.parse(sub));
    } else {
      let propObj = "{";
      let line = source.shift();
      if (!line) reject();
      while (line.indexOf("}") == -1) {
        propObj = propObj.concat(line);
        line = source.shift();
      }
      propObj = propObj.concat("}");

      let result;
      try {
        result = JSON.parse(propObj);

        //TODO: update constants to have required properties for each type, rather
        // than this hacky bit of "isStep tomfoolery"
        if (!result.id) {
          output.warning(
            "This property object has no 'id' field at line " +
              lineNumber +
              "\n",
            propObj
          );
        }

        if (isStepProps && !result.title) {
          output.warning(
            "This step has no 'title' field at line " + lineNumber + "\n",
            propObj
          );
        }

        return resolve(result);
      } catch (err) {
        output.error(
          "Error parsing the following property object of a code block.\n",
          "Usually this means you didn't wrap a property name or value in quotes.\n",
          "Line " + (lineNumber + 1) + ":\n",
          propObj
        );
        return reject(err);
      }
    }
  });
}

exports.buildStepFile = buildStepFile;
