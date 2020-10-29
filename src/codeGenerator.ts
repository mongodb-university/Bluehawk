import * as output from "./output";
import * as constants from "./constants";

export interface CodeFile {
  start: string;
  final: string;
}

export function buildCodeFiles(source: string, type: string): CodeFile {
  const sourceLines = source.split("\n");
  const fileType = type.substr(1);
  let inBlockComment = false;
  let isCommand = false;
  let inHide = false;
  let inStepBlock = false;
  let inReplace = false;
  let replaceIndent;
  let replaceOffset;

  function stripCommentAsNeeded(line) {
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
        const commentType = constants.comments[fileType].line[c];
        if (line.indexOf(commentType) > -1) {
          const regex = new RegExp(commentType, "g");
          replaceOffset = line.indexOf(line.match(regex));
          replaceIndent = replaceOffset + commentType.length;
          if (replaceIndent > 0) return;
        }
      }
      return;
    }
    if (command.indexOf(":replace-with:") > -1) {
      inHide = false;
      inReplace = true;
      for (let c = 0; c < constants.comments[fileType].line.length; c++) {
        const commentType = constants.comments[fileType].line[c];
        output.info(line, commentType, line.indexOf(commentType));
        if (line.indexOf(commentType) > -1) {
          const regex = new RegExp(commentType, "g");
          replaceOffset = line.indexOf(line.match(regex));
          replaceIndent = replaceOffset + commentType.length;
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

  const result = { start: [], final: [] };
  for (let l = 0; l < sourceLines.length; l++) {
    let line = sourceLines[l];
    getCommand(line);
    isBlockComment(line);

    // bucket according to hide/replace rules
    if (!isCommand) {
      if (replaceIndent > 0) {
        line = stripCommentAsNeeded(line);
      }
      if (inHide) {
        result["final"].push(line);
      } else if (inReplace) {
        result["start"].push(line);
      } else {
        result["start"].push(line);
        result["final"].push(line);
      }
    }
  } //end foreach line

  return {
    start: result.start.join("\n"),
    final: result.final.join("\n"),
  };
}
