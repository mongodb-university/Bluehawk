const fs = require("fs");
const output = require("./output");
const builder = require("./builder");

var fileArray = [];

async function openFile(params) {
  let filename = params.source;
  let stages = params.stages;

  if (!fs.existsSync(filename)) {
    output.error("That file or directory doesn't exist!", filename);
    return false;
  }
  if (fs.lstatSync(filename).isDirectory()) {
    output.result("scanning directory '" + filename + "'");
    fs.readdir(filename, async function (err, files) {
      if (err) {
        output.error(err);
        return false;
      }

      let index = 0;
      await files.forEach(async function (file) {
        if (file.startsWith(".")) return;

        let fullname = filename + "/" + file;
        let outPath = params.destination ?? "output";
        let fullOutPath = filename + "/" + outPath + "/" + file;

        if (!fs.existsSync(filename + "/" + outPath)) {
          fs.mkdirSync(filename + "/" + outPath);
        }

        if (fs.lstatSync(fullname).isDirectory()) {
          //TODO: do we want to supported nested folders?
          return;
        }
        output.result("Reading", fullname);
        fileArray[index] = { source: fullname };
        fileArray[index].step = fullOutPath + ".step.rst";

        stages.forEach(async (stage) => {
          fileArray[index][stage] = fullOutPath + "." + stage;
        });

        index++;
      });
      await builder.run(stages, params.type);
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
        for (var x = 0; x < files.length; x++) {
          var file = filename + "/" + files[x];
          if (fs.lstatSync(file).isFile() && !files[x].startsWith(".")) {
            let ext = file.split(".").pop();
            output.result("I am auto-detecting a file type of", ext);
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
