const output = require("./output");
const constants = require("./constants");

let result = {start:[],final:[]}
let source=[];
let fileType;
let inBlockComment = false;
let isCommand = false;
let inHide = false;
let inStepBlock = false;
let inReplace = false;

async function buildCodeFiles(fullFile, type) {
  fileType = type;
  source = fullFile;

  for (l=0;l<source.length;l++){
    let line = source[l];
    
    await isBlockComment(line, fileType);
    getCommand(line).then(async (command) => {
      //output.result('here', line, inBlockComment, isCommand, inStepBlock)
      if (isCommand) {
        // We have a command
        handleCommand(command, line);
      } else {
        // there is no command
        if (inStepBlock) {
          // we're in the middle of a step
          // so we don't include in code output
        } else {
          //not in step-block

          if (line.indexOf("/*")>-1){
            //output.error(line, inBlockComment, inHide, inReplace)
            line = line.replace("/*","");
          }
          if (!inBlockComment && (inHide || inReplace)) {
            //remove comment
            for (c=0;c<constants.comments[fileType].line.length;c++){
              let commentType = constants.comments[fileType].line[c];
              console.log("So I should be here", line)
              if (line.indexOf(commentType) > -1) {
                line = line.replace(commentType, "");
              } 
            }
          }
          
          if (!inHide) {
            result["start"].push(line + "\n");
          }
          if (!inReplace){
            result["final"].push(line + "\n");
          }
        }
      } // no command
    });
  };

  output.result(result)
  return result;
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
  if (command.indexOf(":replace-with:") > -1){
    inReplace = true;
    inHide = false;
  }
  if (command.indexOf(":hide-end:") > -1){
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
      output.error('no longer block comment', line)
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