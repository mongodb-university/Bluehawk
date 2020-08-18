const output = require("./output");
const index = require("./index");
const constants = require("./constants");
const fileHandler = require("./fileHandler");
const util = require("util");
const lineReader = require("line-reader");
const fs = require("fs");

let inBlockComment = false;
let isCommand = false;
let inHide = false;
let inStepBlock = false;

async function run(stages, fileType) {
  console.log("coder start", fileHandler.fileArray);

  fileHandler.fileArray.forEach(async (file) => {
    if (file.source) {
      stages.forEach(async (stage) => {
        await buildFileForStage(file, stage, fileType);
      });
    }
  });
}

async function buildFileForStage(file, stage, fileType) {
  fs.writeFile(file[stage], "", function (err) {
    if (err) output.error(err);
  });

  lineReader.eachLine(file.source, async function (line) {
    await isBlockComment(line, fileType);
    getCommand(line).then(async (command) => {
      if (isCommand) {
        // We have a command
        handleCommand(command, line);
      } else {
        // there is no command
        if (inStepBlock || inHide) {
          //we're in the middle of a step or hide block
          // so we don't include in code output
        } else {
          //not in stepblock and not hidden
          if (!inBlockComment) {
            //remove comment
            await constants.comments[fileType].line.forEach((commentType) => {
              if (line.indexOf(commentType) > -1) {
                let nocomment = line.replace(commentType, "");
                fs.appendFileSync(file[stage], nocomment + "\n");
              } else {
                fs.appendFileSync(file[stage], line + "\n");
              }
            });
          } else {
            fs.appendFileSync(file[stage], line + "\n");
          }
        }
      } // no command
    });
  });

  return;
}

async function handleCommand(command, line) {
  if (command.indexOf(":step-start:") > -1) {
    //ignore all lines until we get to step-end
    inStepBlock = true;
    return;
  }
  if (command.indexOf(":step-end:") > -1) {
    inStepBlock = false;
    return;
  }
  if (command.indexOf(":hide-start:") > -1) {
    // ignore all lines until we get to hide-end
    inHide = true;
    return;
  }
  if (
    command.indexOf(":replace-with:") > -1 ||
    command.indexOf(":hide-end:") > -1
  ) {
    inHide = false;
    return;
  }
}

async function isBlockComment(line, fileType) {
  await constants.comments[fileType].start_block.forEach((commentType) => {
    if (line.indexOf(commentType) > -1) {
      inBlockComment = true;
    }
  });
  await constants.comments[fileType].end_block.forEach((commentType) => {
    if (line.indexOf(commentType) > -1) {
      inBlockComment = false;
    }
  });
  return;
}

async function getCommand(line) {
  isCommand = false;
  let command = "";
  Object.keys(constants.commands).forEach((commandType) => {
    if (line.indexOf(commandType) > -1) {
      isCommand = true;
      command = commandType;
    }
  });
  return command;
}
exports.run = run;
