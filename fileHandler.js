const fs = require("fs");
const output = require("./output");
const builder = require("./builder");

let filename;
let stages;
let destination;

function openFile(params) {
  return new Promise((resolve, reject) => {
    filename = params.source;
    stages = params.stages;
    destination = params.destination;
    
    if (!fs.existsSync(filename)) {
      output.error("That file or directory doesn't exist!", filename);
      return reject(`File or directory doesn't exist: ${filename}`);
    }

    if (fs.lstatSync(filename).isDirectory()) {
      let directory = filename;
      output.info("Scanning directory '" + directory + "'");
      fs.readdir(directory, function (err, files) {
        if (err) {
          output.error(err);
          reject(err);
        }

        let fileArray = [];
        for (let i = 0; i < files.length; i++) {
          fileArray.push(createFileArray(files[i], directory));
        }

        output.info("Building the following files:");
        console.log(fileArray);
        builder.run(fileArray, params.type);
        wrapup();
        resolve();
      });
    } else {
      let fileparts = filename.split("/");
      let file = fileparts.pop();
      let dir = fileparts.join("/");

      let fileArray = createFileArray(file, dir);
      output.info("Building the following files:");
      console.log(fileArray);
      builder.run(fileArray, params.type);
      fileArray = null;
      wrapup();
      resolve();
    }
  });
}

function wrapup() {
  output.info("--------------------------------\n             Done!");

  if (output.warningsList > 0) {
    if (output.warningsList == 1) {
      output.warning(`There was 1 warning.`);
    } else {
      output.warning(`There were ${output.warningsList} warnings.`);
    }
  }
  if (output.errorsList > 0) {
    if (output.errorsList == 1) {
      output.error(`There was 1 error.`);
    } else {
      output.error(`There were ${output.errorsList} errors.`);
    }
  }

  output.info("\n--------------------------------");

  //output.errorsList = [];
  //output.warningsList = [];
}

function createFileArray(file, directory) {
  let tempArray = [];
  if (file.startsWith(".")) {
    return;
  }

  let fullname = directory + "/" + file;
  if (!destination) destination = directory + "/output";
  let stepOutputPath = destination + "/steps";
  let codeOutputPath = destination + "/code";

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  if (!fs.existsSync(stepOutputPath)) {
    fs.mkdirSync(stepOutputPath);
  }
  if (!fs.existsSync(codeOutputPath)) {
    fs.mkdirSync(codeOutputPath);
  }

  if (fs.lstatSync(fullname).isDirectory()) {
    //TODO: do we want to supported nested folders?
    return;
  }
  const fileparts = file.split(".");
  const ext = fileparts[1];
  const baseFileName = fileparts[0];

  output.info("Parsing '" + fullname + "'");

  let index = tempArray.length;
  tempArray[index] = { source: fullname };
  tempArray[index].step = stepOutputPath + "/" + baseFileName + ".step.rst";

  tempArray[index]["codeBlock"] = {};

  stages.forEach((stage) => {
    if (!fs.existsSync(codeOutputPath + "/" + stage)) {
      fs.mkdirSync(codeOutputPath + "/" + stage);
    }

    tempArray[index]["codeBlock"][stage] =
      codeOutputPath + "/" + stage + "/" + baseFileName + ".codeblock";

    tempArray[index][stage] =
      codeOutputPath + "/" + stage + "/" + baseFileName + "." + ext;
  });

  return tempArray;
}

function getFileType(filename) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filename)) {
      output.error("The source file or directory doesn't exist!", filename);
      reject(
        new Error(`The source file or directory doesn't exist: ${filename}`)
      );
    }

    if (fs.lstatSync(filename).isDirectory()) {
      fs.readdir(filename, function (err, files) {
        for (let x = 0; x < files.length; x++) {
          const file = filename + "/" + files[x];
          if (fs.lstatSync(file).isFile() && !files[x].startsWith(".")) {
            let ext = file.split(".").pop();
            return resolve(ext);
          }
        }
      });
    } else {
      let ext = filename.split(".").pop();
      return resolve(ext);
    }
  });
}

exports.openFile = openFile;
exports.getFileType = getFileType;
