const fileHandler = require("./fileHandler");
const output = require("./output");
const constants = require("./constants");
const fs = require('fs');
const { resolve } = require("path");

let inBlockComment = false;
let isCommand = false;
let inStep = false;
let currentStep = "A. ";

var fullFile = [];

async function run(stages, fileType){
   console.log('step-file start', fileHandler.fileArray)
   fileHandler.fileArray.forEach(async file => {
      if (file.source){
         stages.forEach(async stage => {
            buildStepFile(file, stage, fileType);
         });
      }
   });
}

async function buildStepFile(file, stage, fileType){
   fs.writeFile(file.step, "", function(err) {
      if(err) output.error(err);
   });

   fullFile = fs.readFileSync(file.source, 'utf8').split('\n');
   console.log(fullFile);
   
   var line=true;
   while (fullFile.length>0){
      
      line = fullFile.shift();
      console.log(line);
      if (!inStep){
         await checkForStart(line, file);
      } else {
         await checkForNextCommandOrWrite(line, file);
      }
   }
}

async function checkForStart(line, file){
   if (line.indexOf(':step-start:')> -1){
      inStep = true;
      if (line.indexOf('{')> -1){
         var propObj = await buildObjectFromPropsString(line);
         var step = ".. " + propObj.id + "\n" + currentStep + propObj.title;
         fs.appendFileSync(file.step, step + "\n\n");
      } else { //default property
         var title = line.substring((':step-start:').length).trimStart();
         var step = currentStep + title;
         fs.appendFileSync(file.step, step + "\n\n");
      }
   }
}

async function checkForNextCommandOrWrite(line, file){
   if (line.indexOf(':step-end:')> -1){
      inStep = false;
      currentStep = "#. "
      fs.appendFileSync(file.step, "\n\n");
      output.result("END OF STEP")
      return;
   }
   if (line.indexOf(':include-code-block:')> -1){
      //TODO:
      /* parse object, as with step-start
      open final code file that contains the block
      copy it in
      */

      var props = await buildObjectFromPropsString(line);
      output.result(JSON.stringify(props));
      return;
   }

   fs.appendFileSync(file.step, line + "\n");
}
   


async function buildObjectFromPropsString(current){ 
      if (current.indexOf('}')> -1){
         //the props object is all on one line!
         //TODO:
         constants.commands[":hide-start:"].forEach(property => {
         });
         resolve();
      } else{
         var propObj = "{";
         return new Promise((resolve, reject)=> {
            let line = fullFile.shift();
            output.result(line)
            if (!line) reject();
            if (line.indexOf('}') > -1){
               propObj = propObj.concat("}")
               output.result(propObj)
               output.result("I am returning an object, yo!" + JSON.stringify(JSON.parse(propObj)))
               resolve(JSON.parse(propObj));
            } else {
               propObj = propObj.concat(line);
               console.log(propObj)
               resolve(buildObjectFromPropsString(propObj))
            }
         });
      }
}

exports.run = run;