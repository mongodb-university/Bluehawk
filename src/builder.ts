import * as coder from "./codeGenerator";
import * as stepper from "./stepGenerator";
import { getCodeBlocks } from "./getCodeBlocks";
import * as output from "./output";
import fs from "fs";

// Make a function to handle emitted code blocks and save them for the given
// fileObject and type
interface CodeBlockData {
  id: string;
  source: [string];
  stage: string;
}

function makeSaveCodeBlockFunction(
  fileObject: Record<string, string>,
  fileType: string
): (O: CodeBlockData) => void {
  return ({ id, source, stage }) => {
    let whitespaceToRemove = 1000;
    const reg = /[^\s]/g;
    for (let l = 0; l < source.length; l++) {
      if (source[l].search(reg) < whitespaceToRemove) {
        whitespaceToRemove = source[l].search(reg);
      }
    }
    for (let l = 0; l < source.length; l++) {
      source[l] = source[l].substring(whitespaceToRemove);
    }

    const filename = fileObject["codeBlock"][stage] + "." + id + "." + fileType;
    fs.writeFile(filename, source.join("\n"), (err) => {
      if (err) {
        output.error(err.message);
      }
    });
  };
}

export async function run(fileArray, type): Promise<void> {
  let fullFile = [];
  let codeFile: coder.CodeFile;
  let codeBlocks = [];

  for (let f = 0; f < fileArray.length; f++) {
    const file = fileArray[f];
    if (file.source) {
      const saveCodeBlock = makeSaveCodeBlockFunction(file, type);
      // one step file for each file
      fullFile = fs.readFileSync(file.source, "utf8").split("\n");
      try {
        codeBlocks = await getCodeBlocks({
          input: fullFile,
          emitCodeBlock: saveCodeBlock,
        });
      } catch (e) {
        console.error(e);
      }

      fs.writeFile(file.step, "", function (err) {
        if (err) output.error(err.message);
      });

      output.info("Building step file(s) from", file.source);

      const result = stepper.buildStepFile(type, fullFile, codeBlocks);

      //console.log(result.join("").split('\n'))

      fs.appendFileSync(file.step, result.join(""));

      const source = fs.readFileSync(file.source, "utf8");
      output.info("Building code file(s) from", file.source);
      codeFile = coder.buildCodeFiles(source, type);
      fs.writeFileSync(file.start, codeFile["start"]);
      fs.writeFileSync(file.final, codeFile["final"]);
    }
  }
}
