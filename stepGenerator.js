const fileHandler = require("./fileHandler");
const output = require("./output");
const constants = require("./constants");
const util = require('util');
const lineReader = require('line-reader');
const fs = require('fs');

let inBlockComment = false;
let isCommand = false;
let inStep = false;
let currentStep = "";

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
   //output.result(file.step)
   fs.writeFile(file.step, "", function(err) {
      if(err) output.error(err);
   });

   lineReader.open(file.source, function(err, reader) {
      if (err) throw err;
      while (reader.hasNextLine()) {
        reader.nextLine(function(err, line) {
            if (!inStep){
               console.log('not in step')
               checkForStart(reader, line, file);
            } else {
               // /console.log('here?')
               //checkForNextCommandOrWrite(line, file);
            }
         });
      }
      console.log("closing reader")
      reader.close(function(err) {
         if (err) throw err;          
      });
   });
}


async function checkForStart(reader, line, file){
   if (line.indexOf(':step-start:')> -1){
      inStep = true;
      if (currentStep== "" ){
         currentStep = "A. "
      } else {
         currentStep = "#. "
      }
      if (line.indexOf('{')> -1){
         //we have a property object
         //["id","title","parent","next-step"]
         //output.result(constants.commands[":hide-start:"]);
         if (line.indexOf('}')> -1){
            //the props object is all on one line!
            //TODO:
            constants.commands[":hide-start:"].forEach(property => {
            });
         } else{
               var propObj = await buildObjectFromPropsString(reader);
               var step = ".. " + propObj.id + "\n" + currentStep + propObj.title;
               fs.appendFileSync(file.step, step + "\n");
         }
      }
   }
}

function checkForNextCommandOrWrite(line, file){
   console.log("checking", line)
   if (line.indexOf(':step-end:')> -1){
      inStep = false;
      return;
   }
   if (line.indexOf(':include-code-block:')> -1){
      //TODO:
      return;
   }

   // /fs.appendFileSync(file.step, line + "\n");
}
   


async function buildObjectFromPropsString(reader, current){ 
   var propObj = current ?? "{";
   return new Promise((resolve, reject)=> {
      reader.nextLine(function (e,line) {
         if (e) reject(e);
         if (line.indexOf('}') > -1){
            propObj = propObj.concat("}")
            output.result("I am returning an object, yo!" + JSON.stringify(JSON.parse(propObj)))
            resolve(JSON.parse(propObj));
         } else {
            propObj = propObj.concat(line)
            resolve(buildObjectFromPropsString(reader, propObj))
         }
      });
   })
}

exports.run = run;