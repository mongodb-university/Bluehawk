import * as fs from "fs";
import * as path from "path";
import { MessageHandler } from "./messageHandler";
import * as builder from "./builder";

const output = MessageHandler.getMessageHandler();

interface OpenFileParams {
  source: string;
  stages: string[];
  destination: string;
  type: string;
}

export async function openFile({
  source,
  stages,
  destination,
  type,
}: OpenFileParams): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) {
      output.addError("That file or directory doesn't exist!", source);
      return reject(`File or directory doesn't exist: ${source}`);
    }

    if (fs.lstatSync(source).isDirectory()) {
      // TODO: support directories
      console.error("directories aren't currently supported");
    } else {
      const directory = path.dirname(source);

      if (!destination) {
        destination = directory + "/output";
      }
      const stepOutputPath = destination + "/steps";
      const codeOutputPath = destination + "/code";

      const fileArray = createFileInfoArray({
        source,
        stages,
        stepOutputPath,
        codeOutputPath,
      });
      makeFiles(destination, stepOutputPath, codeOutputPath, stages);
      builder.run(fileArray, type);
      resolve();
    }
  });
}

export function getFileType(source: string): string {
  if (!fs.existsSync(source)) {
    throw new Error(`The source file or directory doesn't exist: ${source}`);
  }

  if (fs.lstatSync(source).isDirectory()) {
    fs.readdir(source, function (err, files) {
      for (let x = 0; x < files.length; x++) {
        const file = source + "/" + files[x];
        if (fs.lstatSync(file).isFile() && !files[x].startsWith(".")) {
          return path.extname(file).substr(1);
        }
      }
    });
  } else {
    return path.extname(source).substr(1);
  }
}

// function isHidden(file: string): boolean {
//   return /(^|\/)\.[^/.]/g.test(file);
// }

interface FileInfoParams {
  source: string;
  stepOutputPath: string;
  codeOutputPath: string;
  stages: string[];
}

export function createFileInfoArray({
  source,
  stepOutputPath,
  codeOutputPath,
  stages,
}: FileInfoParams): any {
  // TODO: Refactor from record to interface or class
  const fileInfoArray = [];
  const ext = path.extname(source);
  const file = path.basename(source).split(".").shift();
  if (fs.lstatSync(source).isDirectory()) {
    // TODO: allow operating on entire directories
    // const fileArray = fs
    //   .readdirSync(source)
    //   .filter((file) => !isHidden(file))
    //   .map((file) =>
    //     createFileArray({ source: file, stages, destination, type })
    //   );
    // return fileArray;
    return [];
  } else {
    fileInfoArray.push({ source });
    const index = fileInfoArray.length - 1;
    fileInfoArray[index].step = stepOutputPath + "/" + file + ".step.rst";

    fileInfoArray[index]["codeBlock"] = {};

    stages.forEach((stage) => {
      fileInfoArray[index]["codeBlock"][stage] =
        codeOutputPath + "/" + stage + "/" + file + ".codeblock";

      fileInfoArray[index][stage] =
        codeOutputPath + "/" + stage + "/" + file + ext;
    });
    return fileInfoArray;
  }
}

export function makeFiles(
  destination: string,
  stepOutputPath: string,
  codeOutputPath: string,
  stages: string[]
): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  if (!fs.existsSync(stepOutputPath)) {
    fs.mkdirSync(stepOutputPath);
  }
  if (!fs.existsSync(codeOutputPath)) {
    fs.mkdirSync(codeOutputPath);
  }
  stages.forEach((stage) => {
    if (!fs.existsSync(codeOutputPath + "/" + stage)) {
      fs.mkdirSync(codeOutputPath + "/" + stage);
    }
  });
}
