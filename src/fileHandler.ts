import * as fs from "fs";
import * as path from "path";
import * as output from "./output";
import * as builder from "./builder";

interface OpenFileParams {
  source: string;
  stages: [string];
  destination: string;
  type: string;
}

export function openFile({
  source,
  stages,
  destination,
  type,
}: OpenFileParams): Promise<void> {
  // Helper to create snippet file array
  function createFileArray(file: string, directory: string) {
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

    const index = tempArray.length;
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

    if (output.warningsList.length > 0) {
      if (output.warningsList.length == 1) {
        output.warning(`There was 1 warning.`);
      } else {
        output.warning(`There were ${output.warningsList} warnings.`);
      }
    }
    if (output.errorsList.length > 0) {
      if (output.errorsList.length == 1) {
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
          output.error(err.message);
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
      const directory = path.dirname(source);
      const file = path.basename(source);

      const fileArray = createFileArray(file, directory);
      output.info("Building the following files:");
      console.log(fileArray);
      builder.run(fileArray, type);
      wrapup();
      resolve();
    }
  });
}

export function getFileType(source) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) {
      output.error("The source file or directory doesn't exist!", source);
      reject(
        new Error(`The source file or directory doesn't exist: ${source}`)
      );
    }
    let ext: string;

    if (fs.lstatSync(source).isDirectory()) {
      fs.readdir(source, function (err, files) {
        for (let x = 0; x < files.length; x++) {
          const file = source + "/" + files[x];
          if (fs.lstatSync(file).isFile() && !files[x].startsWith(".")) {
            ext = file.split(".").pop();
            return resolve(ext);
          }
        }
      });
    } else {
      ext = source.split(".").pop();
      return resolve(ext);
    }
  });
}
