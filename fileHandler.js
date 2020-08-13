const fs = require('fs');
const path = require('path');
const index = require("./index");
const output = require("./output");
const coder = require("./codeGenerator");
const stepper = require("./stepGenerator");
const util = require('util')


var fileArray = [];

async function openFile(params) {

   let filename = params.source;
   let stages = params.stages.split(',');
   console.log(stages)

   if (!fs.existsSync(filename)){
      output.error("That file or directory doesn't exist!", filename);
      return false;
   }
   if (fs.lstatSync(filename).isDirectory()) {
      output.result("scanning directory '" + filename + "'");
      fs.readdir(filename, async function(err, files) {
         if (err){
            output.error(err);
            return false;
         }

         let index=0;
         await files.forEach(async function(file) {
            if (file.startsWith('.')) return;
            
            let fullname = filename + "/" + file;
            let outPath = params.destination ?? "output";
            let fullOutPath = filename + "/" + outPath + "/" + file;
            
            if (!fs.existsSync(filename + "/" + outPath)){
               fs.mkdirSync(filename + "/" + outPath);
           }
           
            if (fs.lstatSync(fullname).isDirectory()){
                //TODO: do we want to supported nested folders?
               return;
            }
            output.result("Reading " + fullname);
            //let data = await readFile(file);
            fileArray[index] = {source: fullname};
         
            stages.forEach(async stage => {  
               fileArray[index][stage] = filename + "/" + outPath + "/" + file + "." + stage;
            });

            //output.result(util.inspect(fileArray[index]));


         await coder.run(stages, params.type);
         await stepper.run();

         });

         
         return true;
      });
   } else {
      output.result("Processing " + filename);
      let data = await readFile(filename);
      fileArray.push({name:filename, data:[{source: data}]});
      await coder.run();
      await stepper.run();
          return true;
   }
}

async function readFile(filename){
   return fs.readFileSync(filename, 'utf8', function (err, data) {
      if (err) {
         output.error(err);
         return false;
      }
      return data;
   });
}

async function writeFile(filename){
   
}

exports.openFile = openFile;
exports.writeFile = writeFile;
exports.fileArray = fileArray;