const coder = require("./codeGenerator");
const output = require("./output");
const fs = require("fs");

let fullFile = [];
let fileType;
let codeFile;

function run(fileArray, type) {
  fileType = type;
  for (let f = 0; f < fileArray.length; f++) {
    let file = fileArray[f];
    if (file.source) {
      // one step file for each file
      fullFile = fs.readFileSync(file.source, "utf8").split("\n");
      try {
        getCodeBlocks(fullFile, file);
      } catch (e) {
        console.error(e);
      }

      fs.writeFile(file.step, "", function (err) {
        if (err) output.error(err);
      });

      /*output.info("Building step file(s) from", file.source);

      let result = await stepper.buildStepFile(
        fileType,
        fullFile,
        codeBlocks
      );

      //console.log(result.join("").split('\n'))

      fs.appendFileSync(file.step, result.join(""));*/

      let source = fs.readFileSync(file.source, "utf8").split("\n");
      output.info("Building code file(s) from", file.source);
      codeFile = coder.buildCodeFiles(source, fileType);
      fs.writeFileSync(file.start, codeFile["start"].join(""));
      fs.writeFileSync(file.final, codeFile["final"].join(""));
    }
  }
}

function getCodeBlocks(input, fileObject) {
  let result = [];

  let starter = false;
  let final = false;
  let codeBlockProps = [];

  let inCodeBlock = false;
  for (const [index, codeLine] of input.entries()) {
    let id;
    let counter = index + 1;
    let nextCodeLine = input[counter];

    if (codeLine.indexOf(":code-block-start:") > -1) {
      inCodeBlock = true;
      let starterCodeLines = [];
      let finalCodeLines = [];

      //build code block and store for future lookup

      if (codeLine.indexOf("{") > -1) {
        //we have a property object
        codeBlockProps = safeBuildObjectFromPropsString(index + 1);
        id = codeBlockProps.id.trim();
        while (nextCodeLine.indexOf("}") == -1) {
          counter++;
          nextCodeLine = input[counter];
        }
        counter++;
      } else {
        let matchAll = Array.from(codeLine.matchAll(":"));
        id = codeLine
          .substring(matchAll[matchAll.length - 1].index + 1)
          .replace("*/", "")
          .trim();
      }

      if (id.indexOf(" ") > -1) {
        output.warning("The {id} of this code block contains spaces:", id);
      }
      while (nextCodeLine && nextCodeLine.indexOf(":code-block-end:") == -1) {
        nextCodeLine = input[counter];
        if (nextCodeLine == undefined) {
          output.error(
            `I expected a ':code-block-end:' but didn't find one.\n,
            This is the last code block I was working on at line ${counter}`
          );
          console.log(finalCodeLines);
          throw new Error(`I expected a ':code-block-end:' but didn't find one.\n,
            This is the last code block I was working on at line ${counter}`);
        }
        if (nextCodeLine.indexOf(":hide-start:") > -1) {
          final = true;
          starter = false;
          counter++;
          continue;
        } else if (nextCodeLine.indexOf(":hide-end:") > -1) {
          starter = true;
          final = true;
          counter++;
          continue;
        } else if (nextCodeLine.indexOf(":replace-with:") > -1) {
          final = false;
          starter = true;
          counter++;
          continue;
        } else if (nextCodeLine.indexOf(":code-block-end:") > -1) {
          saveCodeBlock(id, starterCodeLines, fileObject, "start");
          saveCodeBlock(id, finalCodeLines, fileObject, "final");
          counter++;
          continue;
        }

        if (starter) {
          starterCodeLines.push(nextCodeLine);
        }
        if (final) {
          finalCodeLines.push(nextCodeLine);
        }

        counter++;
      }

      result.push({
        id: id,
        startCode: starterCodeLines,
        endCode: finalCodeLines,
        props: codeBlockProps,
      });
    } // end code block
    else if (codeLine.indexOf(":code-block-end:") > -1) {
      inCodeBlock = false;
    }
    if (
      !inCodeBlock &&
      (codeLine.indexOf(":hide-start:") > -1 ||
        codeLine.indexOf(":hide-end:") > -1)
    ) {
      output.error(
        `I found a 'hide' command outside of a code block at line ${counter}.`,
        codeLine
      );
    }
  }
  return result;
}

function safeBuildObjectFromPropsString(index) {
  if (fullFile[index].indexOf("}") > -1) {
    const propsString = fullFile[index].split(",");
    return JSON.parse(propsString);
  } else {
    let propObj = "{";
    while (fullFile[index].indexOf("}") == -1) {
      propObj = propObj.concat(fullFile[index]);
      index++;
    }
    propObj = propObj.concat("}");
    return JSON.parse(propObj);
  }
}

function saveCodeBlock(id, source, fileObject, stage) {
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
      output.error(err);
    }
  });
}

exports.run = run;
