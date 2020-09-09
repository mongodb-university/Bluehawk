const output = require("./output");
const constants = require("./constants");

let fileType;
let inBlockComment = false;
let isCommand = false;
let inHide = false;
let inStepBlock = false;
let inReplace = false;
let replaceIndent;
let replaceOffset;

function buildCodeFiles(source, type) {
  let result = { start: [], final: [] };
  fileType = type;
  for (let l = 0; l < source.length; l++) {
    let line = source[l];
    getCommand(line);
    isBlockComment(line);

    // bucket according to hide/replace rules
    if (!isCommand) {
      if (replaceIndent > 0) {
        console.log("replaceIndent", replaceIndent, line);
        line = stripCommentAsNeeded(line);
      }
      if (inHide) {
        result["final"].push(line + "\n");
      } else if (inReplace) {
        result["start"].push(line + "\n");
      } else {
        result["start"].push(line + "\n");
        result["final"].push(line + "\n");
      }
    }
  } //end foreach line
  if (result["start"][result["start"].length - 1] == "\n")
    result["start"].pop();
  if (result["final"][result["final"].length - 1] == "\n")
    result["final"].pop();
  console.log(result);
  return result;
}

function stripCommentAsNeeded(line) {
  console.log("start strip", line, replaceIndent);
  console.log("return strip", line.substring(replaceIndent));
  if (!inHide && !inBlockComment) {
    return line.slice(0, replaceOffset) + line.slice(replaceIndent);
  }
  return line;
}

function handleCommand(command, line) {
  //output.info(command, line, line.indexOf(command))
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
    for (let c = 0; c < constants.comments[fileType].line.length; c++) {
      let commentType = constants.comments[fileType].line[c];
      if (line.indexOf(commentType) > -1) {
        const regex = new RegExp(commentType, "g");
        console.log("hidestart", line, line.indexOf(line.match(regex)));
        replaceOffset = line.indexOf(line.match(regex));
        replaceIndent = replaceOffset + commentType.length;
        console.log("replaceOffset:", replaceOffset);
        console.log("replaceIndent:", replaceIndent);
        if (replaceIndent > 0) return;
      }
    }
    return;
  }
  if (command.indexOf(":replace-with:") > -1) {
    inHide = false;
    inReplace = true;
    for (let c = 0; c < constants.comments[fileType].line.length; c++) {
      let commentType = constants.comments[fileType].line[c];
      output.info(line, commentType, line.indexOf(commentType));
      if (line.indexOf(commentType) > -1) {
        const regex = new RegExp(commentType, "g");
        console.log("replacewith", line, line.indexOf(line.match(regex)));
        replaceOffset = line.indexOf(line.match(regex));
        replaceIndent = replaceOffset + commentType.length;
        console.log("replaceOffset:", replaceOffset);
        console.log("replaceIndent:", replaceIndent);
        if (replaceIndent > 0) return;
      }
    }
    return;
  }
  if (command.indexOf(":hide-end:") > -1) {
    inHide = false;
    inReplace = false;
    replaceIndent = 0;
  }
  return;
}

function isBlockComment(line) {
  constants.comments[fileType].start_block.forEach((commentType) => {
    if (line.indexOf(commentType) > -1) {
      inBlockComment = true;
    }
  });
  constants.comments[fileType].end_block.forEach((commentType) => {
    if (line.indexOf(commentType) > -1) {
      inBlockComment = false;
    }
  });
}

function getCommand(line) {
  isCommand = false;
  let command = "";
  Object.keys(constants.commands).forEach((commandType) => {
    if (line.indexOf(commandType) > -1) {
      isCommand = true;
      command = commandType;
      handleCommand(command, line);
    }
  });
  return command;
}

exports.buildCodeFiles = buildCodeFiles;
