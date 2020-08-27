const fs = require("fs");
const output = require("./output");
const builder = require("./builder");

let fileArray = [];

async function openFile(params) {
  let filename = params.source;
  let stages = params.stages;

  if (!fs.existsSync(filename)) {
    output.error("That file or directory doesn't exist!", filename);
    return false;
  }
  if (fs.lstatSync(filename).isDirectory()) {
    let directory = filename;
    output.result("scanning directory '" + directory + "'");
    fs.readdir(directory, async function (err, files) {
      if (err) {
        output.error(err);
        return false;
      }

      let index = 0;
      await files.forEach(async function (file) {
        if (file.startsWith(".")) return;

        let fullname = directory + "/" + file;
        let stepOutputPath = params.destination ?? "output/steps";
        let codeOutputPath = params.destination ?? "output/code";
        if (!fs.existsSync(directory + "/output")) {
          fs.mkdirSync(directory + "/output");
        }
        if (!fs.existsSync(directory + "/" + stepOutputPath)) {
          fs.mkdirSync(directory + "/" + stepOutputPath);
        }
        if (!fs.existsSync(directory + "/" + codeOutputPath)) {
          fs.mkdirSync(directory + "/" + codeOutputPath);
        }

        if (fs.lstatSync(fullname).isDirectory()) {
          //TODO: do we want to supported nested folders?
          return;
        }

        const fileparts = file.split(".");
        const ext = fileparts[1];
        const baseFileName = fileparts[0];

        output.result("Processing '" + fullname + "'");

        fileArray[index] = { source: fullname };
        fileArray[index].step =
          directory + "/" + stepOutputPath + "/" + baseFileName + ".step.rst";

        fileArray[index]["codeBlock"] = {};

        stages.forEach(async (stage) => {
          if (!fs.existsSync(directory + "/" + codeOutputPath + "/" + stage)) {
            fs.mkdirSync(directory + "/" + codeOutputPath + "/" + stage);
          }

          fileArray[index]["codeBlock"][stage] =
            directory +
            "/" +
            codeOutputPath +
            "/" +
            stage +
            "/" +
            baseFileName +
            ".codeblock";

          fileArray[index][stage] =
            directory +
            "/" +
            codeOutputPath +
            "/" +
            stage +
            "/" +
            baseFileName +
            "." +
            ext;
        });

        index++;
      });
      await builder.run(stages, params.type);

      output.header("DONE!");
    });
  } else {
    // TODO
    /*await builder.run(stages, params.type);
    return true;*/
  }
}

async function getFileType(filename) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filename)) {
      output.error("The source file or directory doesn't exist!", filename);
      reject();
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
      return ext;
    }
  });
}

exports.openFile = openFile;
exports.fileArray = fileArray;
exports.getFileType = getFileType;
