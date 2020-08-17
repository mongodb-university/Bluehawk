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
            await buildStepFile(file, stage, fileType);
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
      if (reader.hasNextLine()) {
        reader.nextLine(function(err, line) {
         if (!inStep){
         //look for step-start
         //parse step-start object
         // if there's no object, get default
         checkForStart(reader, line);
       }
       
    });
   }
   else {
     reader.close(function(err) {
       if (err) throw err;          
     });
   }
 });
}


async function checkForStart(reader, line){
   if (line.indexOf(':step-start:')> -1){
      inStep = true;
      if (currentStep==""){
         currentStep == "A. "
      } else {
         currentStep = "#. "
      }
      if (line.indexOf('{')> -1){
         //we have a property object
         //["id","title","parent","next-step"]
         //output.result(constants.commands[":hide-start:"]);
         if (line.indexOf('}')> -1){
            //the props object is all on one line!
            //TODO
            constants.commands[":hide-start:"].forEach(property => {
            });
         } else{
               //write out id as a comment
               var propObj = await buildObjectFromPropsString(reader);
               console.log(propObj);
               var id = ".. ".concat(propObj.id, "\n");
               var step = id.concat(currentStep, propObj.title);

               output.result(file.step, step + "\n");
               fs.appendFileSync(file.step, step + "\n");
         }


         
      }
   }
}

async function buildObjectFromPropsString(reader, current){ 
   var propObj = current ?? "{";
   return reader.nextLine(function (e,line) {
      if (line.indexOf('}') > -1){
         propObj = propObj.concat("}")
         output.result("I am returning an object, yo!" + JSON.stringify(JSON.parse(propObj)))
         JSON.parse(propObj);
      } else {
         propObj = propObj.concat(line)
         buildObjectFromPropsString(reader, propObj)
      }
   });
}

exports.run = run;