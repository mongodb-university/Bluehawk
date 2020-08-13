const output = require("./output");
const index = require("./index");
const constants = require("./constants");
const fileHandler = require("./fileHandler");
const util = require('util');
const lineReader = require('line-reader');
const fs = require('fs');


async function run(stages, fileType){
   console.log('coder start', stages, fileType, fileHandler.fileArray)

   fileHandler.fileArray.forEach(async file => {
      console.log('*****', file)
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

    lineReader.eachLine(file.source, async function(line){
        isComment(line, fileType).then(async isComment=>{
           if (isComment) {
              isCommand(line).then(async isCommand =>{
                  if (isCommand){ 
                     //output.result('comment + command');
                     //TODO do something very interesting
                  } else {
                     //output.result('comment only')
                     fs.appendFileSync(file[stage], line + "\n");
                  }
               })
            } else {
               //output.result('not comment')
               fs.appendFileSync(file[stage], line + "\n");
            }
        });
   });

   fs.readFileSync(file[stage], 'utf8', function (err, data) {
      if (err) {
         output.error(err);
         return false;
      }
      output.result(data);
   });
   return;
}


async function isComment(line, fileType) {
   let isComment = false;
   await constants.comments[fileType].forEach(commentType => {
      if (line.indexOf(commentType) > -1) {
         console.log('found comment', line)
         isComment = true;
      }
   });
   return isComment;
}

async function isCommand(line) {
   let isCommand = false;
   await constants.commands.forEach(commandType => {
      if (line.indexOf(commandType) > -1) {
         console.log('found command', line)
         isCommand = true;
      }
   });
   return isCommand;
}

async function parseCodeBlock(){}


exports.run = run;