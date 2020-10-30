import { MessageHandler } from "./messageHandler";
import * as constants from "./constants";

const output = MessageHandler.getMessageHandler();

let inStep = false;
let currentStep = "A. ";
const fullOutput = [];
let source = [];
let codeBlocks = [];
let lineNumber;
let fullLength;

export function buildStepFile(fileType, fullFile, code) {
  fullLength = fullFile.length;
  source = fullFile;
  codeBlocks = code;

  let line = true;
  while (source.length > 0) {
    line = source.shift();
    lineNumber = fullLength - source.length;
    if (!inStep) {
      checkForStart(line);
    } else {
      checkForNextCommandOrWrite(line, fileType);
    }
  }
  return fullOutput;
}

export function checkForStart(line) {
  if (line.indexOf(":step-start:") > -1) {
    inStep = true;
    if (line.indexOf("{") > -1) {
      const propObj = buildObjectFromPropsString(line, true);
      const step = ".. " + propObj.id + "\n" + currentStep + propObj.title;
      fullOutput.push(step + "\n\n");
    } else {
      //default property
      const title = line.substring(":step-start:".length).trimStart();
      const step = currentStep + title;
      fullOutput.push(step + "\n\n");
    }
  }
}

export function checkForNextCommandOrWrite(line, fileType) {
  if (line.indexOf(":step-end:") > -1) {
    inStep = false;
    currentStep = "#. ";
    fullOutput.push("\n\n");
    return;
  }

  if (line.indexOf(":include-code-block:") > -1) {
    const props = buildObjectFromPropsString(line, false);
    if (props && props.id) {
      if (props.id.indexOf(".") > -1) {
        //TODO: link to a foreign file
      } else {
        const codeBlock = codeBlocks.find((e) => e.id == props.id);
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
            outputCode = outputCode.concat(codeBlock.finalCode.join("\n\t"));
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

export function buildObjectFromPropsString(current, isStepProps) {
  if (current.indexOf("}") > -1) {
    //the props object is all on one line
    const sub = current.substring(":include-code-block:".length);
    return JSON.parse(sub);
  } else {
    let propObj = "{";
    let line = source.shift();
    if (!line) {
      throw new Error("no line");
    }
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
        output.addWarning(
          "This property object has no 'id' field at line " + lineNumber + "\n",
          propObj
        );
      }

      if (isStepProps && !result.title) {
        output.addWarning(
          "This step has no 'title' field at line " + lineNumber + "\n",
          propObj
        );
      }

      return result;
    } catch (err) {
      output.addError(
        "Error parsing the following property object of a code block.\n",
        "Usually this means you didn't wrap a property name or value in quotes.\n",
        "Line " + (lineNumber + 1) + ":\n",
        propObj
      );
      throw new Error(`Line ${lineNumber + 1}: ${propObj}`);
    }
  }
}
