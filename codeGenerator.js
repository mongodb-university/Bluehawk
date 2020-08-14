const output = require("./output");
const index = require("./index");
const constants = require("./constants");
const fileHandler = require("./fileHandler");
const util = require('util');
const lineReader = require('line-reader');
const fs = require('fs');

let inBlockComment = false;
let isCommand = false;
let inHide = false;
let inStepBlock = false;

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
      await isBlockComment(line, fileType);
      getCommand(line).then(async command => {
         if (isCommand) { // We have a command 
            //console.log('1' + isCommand + inStepBlock + line)
            handleCommand(command, line)
         } else { // there is no command
            console.log('2' + line + inStepBlock + inHide + inBlockComment)
            if (inStepBlock || inHide) {
               //we're in the middle of a step or hide block
               // so we don't include in code output
               //console.log('3' + isCommand + inStepBlock)
            } else {
               //not in stepblock and not hidden
               if (!inBlockComment){ 
                  //remove comment
                  output.result("inblockcomment" + line)
                  await constants.comments[fileType].line.forEach(commentType => {
                     if (line.indexOf(commentType) > -1) {
                        let nocomment = line.replace(commentType, "");
                        output.result("nocomment" + nocomment)
                        fs.appendFileSync(file[stage], nocomment + "\n");
                     } else {
                        fs.appendFileSync(file[stage], line + "\n");
                     }
                  });
               } else {
                  output.result("writing " + line)
                  fs.appendFileSync(file[stage], line + "\n");
               }
            }
         }  // no command
      });
   });
   
   /*fs.readFileSync(file[stage], 'utf8', function (err, data) {
      if (err) {
         output.error(err);
         return false;
      }
      //output.result(data);
   });*/
   return;
}

async function handleCommand(command, line) {
   if (command.indexOf(":step-start:") > -1) {
      //ignore all lines until we get to step-end
      //console.log('we should get here', line)
      inStepBlock = true;
      console.log("inStep", inStepBlock)
      return;
   }
   if (command.indexOf(":step-end:")> -1) {
      inStepBlock = false;
      return;
   }
   if (command.indexOf(":hide-start:") > -1) {
      // ignore all lines until we get to hide-end
      inHide = true;
      return;
   }
   if (command.indexOf(":replace-with:") > -1 
            || command.indexOf(":hide-end:") > -1) {
         inHide = false;
         return;
   }

  /* if (isCommand){
      //look for end
      if (command.indexOf(":step-end:")> -1) {
         inStep = false;
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
  

   
      // command with default params (or no params)
   //console.log("command, inCommand, inHide", command, inCommand, inHide)
}


async function isBlockComment(line, fileType) {
   /*let isComment = false;
   await constants.comments[fileType].line.forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         isComment = true;
      }
   });*/
   await constants.comments[fileType].start_block.forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         inBlockComment = true;
      }
   });
   await constants.comments[fileType].end_block.forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         inBlockComment = false;
      }
   });
   //output.error("isComment?" + line + inBlockComment)
   return;
}

async function getCommand(line) {
   isCommand = false;
   let command = "";
   await constants.commands.forEach(commandType => {
      if (line.indexOf(commandType) > -1) {
         isCommand = true;
         command = commandType;
      }
   });
   if (command != "") console.log('isCommand: ', command, isCommand)
   return command;
}


exports.run = run;