const output = require("./output");
const index = require("./index");
const constants = require("./constants");
const fileHandler = require("./fileHandler");
const util = require('util');
const lineReader = require('line-reader');
const fs = require('fs');

let inBlockComment = false;
let inCommand = false;
let inHide = false;

async function run(stages, fileType){
   console.log('coder start', stages, fileType, fileHandler.fileArray)

   fileHandler.fileArray.forEach(async file => {
      if (file.source){
         stages.forEach(async stage => {
            await buildFileForStage(file, stage, fileType);
         });
         
         output.result(file.name)
         output.result(file.source);
      }
   });
}

async function buildFileForStage(file, stage, fileType){
   fs.writeFile(file[stage], "", function(err) {
      if(err) output.error(err);
    });

    lineReader.eachLine(file.source, async function(line) {
        isComment(line, fileType).then(async isComment=>{
           if (isComment || inBlockComment) {
               isCommand(line).then(async command => {
                  if (command != "") { 
                     // We have a command! 
                     handleCommand(command, line)
                  } else {
                     // we're in a comment, but there is no command
                     // so we are either in a block comment 
                     // or we have a comment line that we want to write out
                     if (!inBlockComment) {
                        // we should only get here if we're on an END block comment
                        // we don't want to write this line out unless it's 
                        // part of the output text
                        //console.log("end of block?", line, command)
                        if (command == ":step-end:" || command == "") {
                          // console.log('end of block and what???')
                           fs.appendFileSync(file[stage], line + "\n");
                        }
                     } else {
                        // we're in a block. Ignore or write?
                        output.error("// we're in a block. Ignore or write?" + line + command + inHide + inCommand)
                        if (!inHide && !inCommand){
                           //should be true false false
                           //console.log('writing:', line, inBlockComment, inHide, inCommand)
                           fs.appendFileSync(file[stage], line + "\n");
                        }
                     }
                     
                     
                     /*else if (!inBlockComment && !inHide && !inCommand) {
                        console.log('writing...', line, inBlockComment)
                        fs.appendFileSync(file[stage], line + "\n");
                     }*/ 
                  }
               })
            } else {
               // regular line of text/code; write it to output
               console.log('****', line + inBlockComment + inHide + inCommand)
               if (!inBlockComment && !inHide && !inCommand){
                  console.log('writing', line)
                  fs.appendFileSync(file[stage], line + "\n");
               } 
            }
        });
   });

   fs.readFileSync(file[stage], 'utf8', function (err, data) {
      if (err) {
         output.error(err);
         return false;
      }
      //output.result(data);
   });
   return;
}

async function handleCommand(command, line) {
   //output.result(command + " " + line)
   //console.log("handleCommand - inCommand, inHide", inCommand, inHide)
   if (inCommand){
      //look for end
      if (command.indexOf(":step-end:")> -1) {
         inCommand = false;
      }
      return;
   }
   if (inHide){
      if (command.indexOf(":replace-with:") > -1 
            || command.indexOf(":hide-end:") > -1) {
         inHide = false;
      }
   }
   /*if (line.indexOf('{') > -1) {
      //we have an object we need to deal with
      //TODO!
   } else {*/
   if (command.indexOf(":step-start:") > -1) {
      //ignore all lines until we get to step-end
      //console.log('we should get here', line)
      inCommand = true;
   } else if (command.indexOf(":hide-start:") > -1) {
      //ignore all lines until we get to hide-end
      inHide = true;
   }
   
      // command with default params (or no params)
   //console.log("command, inCommand, inHide", command, inCommand, inHide)
}


async function isComment(line, fileType) {
   let isComment = false;
   await constants.comments[fileType].line.forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         isComment = true;
      }
   });
   await constants.comments[fileType].start_block.forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         isComment = true;
         inBlockComment = true;
      }
   });
   await constants.comments[fileType].end_block.forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         isComment = false;
         inBlockComment = true;
      }
   });
   output.error("isComment?" + line + isComment + inBlockComment)
   return isComment;
}

async function isCommand(line) {
   let command = "";
   await constants.commands.forEach(commandType => {
      if (line.indexOf(commandType) > -1) {
         command = commandType;
      }
   });
   if (command != "") console.log('isCommand: ', command)
   return command;
}


exports.run = run;