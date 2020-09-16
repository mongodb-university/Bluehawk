const fs = require("fs");
const output = require("./output");
const builder = require("./builder");

function openFile({ source, stages, destination, type }) {
  // Helper to create snippet file array
  function createFileArray(file, directory) {
    const tempArray = [];
    if (file.startsWith(".")) {
      return;
    }

    const fullname = directory + "/" + file;
    if (!destination) {
      destination = directory + "/output";
    }
    const stepOutputPath = destination + "/steps";
    const codeOutputPath = destination + "/code";

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
    const basesource = fileparts[0];

    output.info("Parsing '" + fullname + "'");

    let index = tempArray.length;
    tempArray[index] = { source: fullname };
    tempArray[index].step = stepOutputPath + "/" + basesource + ".step.rst";

    tempArray[index]["codeBlock"] = {};

    stages.forEach((stage) => {
      if (!fs.existsSync(codeOutputPath + "/" + stage)) {
        fs.mkdirSync(codeOutputPath + "/" + stage);
      }

      tempArray[index]["codeBlock"][stage] =
        codeOutputPath + "/" + stage + "/" + basesource + ".codeblock";

      tempArray[index][stage] =
        codeOutputPath + "/" + stage + "/" + basesource + "." + ext;
    });

    return tempArray;
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

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) {
      output.error("That file or directory doesn't exist!", source);
      return reject(`File or directory doesn't exist: ${source}`);
    }

    if (fs.lstatSync(source).isDirectory()) {
      const directory = source;
      output.info("Scanning directory '" + directory + "'");
      fs.readdir(directory, function (err, files) {
        if (err) {
          output.error(err);
          reject(err);
        }

        const fileArray = files.map((file) => createFileArray(file, directory));

        output.info("Building the following files:");
        console.log(fileArray);
        builder.run(fileArray, type);
        wrapup();
        resolve();
      });
    } else {
      const fileparts = source.split("/");
      const file = fileparts.pop();
      const directory = fileparts.join("/");

      const fileArray = createFileArray(file, directory);
      output.info("Building the following files:");
      console.log(fileArray);
      builder.run(fileArray, type);
      wrapup();
      resolve();
    }
  });
}

function getFileType(source) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) {
      output.error("The source file or directory doesn't exist!", source);
      reject(
        new Error(`The source file or directory doesn't exist: ${source}`)
      );
    }

    if (fs.lstatSync(source).isDirectory()) {
      fs.readdir(source, function (err, files) {
        for (let x = 0; x < files.length; x++) {
          const file = source + "/" + files[x];
          if (fs.lstatSync(file).isFile() && !files[x].startsWith(".")) {
            let ext = file.split(".").pop();
            return resolve(ext);
          }
        }
      });
    } else {
      let ext = source.split(".").pop();
      return resolve(ext);
    }
  });
}

exports.openFile = openFile;
exports.getFileType = getFileType;
