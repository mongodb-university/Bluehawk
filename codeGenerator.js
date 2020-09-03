const output = require("./output");
const constants = require("./constants");

let fileType;
let inBlockComment = false;
let isCommand = false;
let inHide = false;
let inStepBlock = false;
let inReplace = false;

async function buildCodeFiles(source, type) {
  let result = { start: [], final: [] };
  return new Promise(async (resolve, reject) => {
    fileType = type;
    for (l = 0; l < source.length; l++) {
      let line = source[l];

      let command = await getCommand(line);

      if (line.indexOf("*/") > -1 && !inBlockComment) {
        line = line.replace("*/", "");
        inBlockComment = false;
      }

      await isBlockComment(line, fileType);

      if (isCommand) {
        handleCommand(command, line);
      } else {
        if (!inStepBlock) {
          if (!inBlockComment && (inReplace || inHide)) {
            //remove comment
            for (c = 0; c < constants.comments[fileType].line.length; c++) {
              let commentType = constants.comments[fileType].line[c];
              if (line.indexOf(commentType) > -1) {
                line = line.replace(commentType, "");
              }
            }
          }
          if (!inHide) {
            result["start"].push(line + "\n");
          }
          if (!inReplace) {
            result["final"].push(line + "\n");
          }
        }
      }
    }
    if (result["start"][result["start"].length - 1] == "\n")
      result["start"].pop();
    if (result["final"][result["final"].length - 1] == "\n")
      result["final"].pop();
    return resolve(result);
  });
}

async function handleCommand(command, line) {
  if (command.indexOf(":step-start:") > -1) {
    inStepBlock = true;
    return;
  }
  if (command.indexOf(":step-end:") > -1) {
    inStepBlock = false;
    return;
  }
  if (command.indexOf(":hide-start:") > -1) {
    inHide = true;
    return;
  }
  if (command.indexOf(":replace-with:") > -1) {
    inReplace = true;
    inHide = false;
  }
  if (command.indexOf(":hide-end:") > -1) {
    inHide = false;
    inReplace = false;
  }
  return;
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

exports.buildCodeFiles = buildCodeFiles;
