const output = require("./output");

function getCodeBlocks({ input, emitCodeBlock }) {
  let result = [];
  let starter = true;
  let final = false;
  let codeBlockProps = [];
  let inCodeBlock = false;

  function safeBuildObjectFromPropsString(index) {
    const fullFile = input;
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

  input.forEach((codeLine, index) => {
    let id;
    let counter = index + 1;
    let nextCodeLine = input[counter];

    // Range has two elements: begin and end, which each have line and column
    let range = [{}, {}];
    const codeBlockStartIndex = codeLine.indexOf(":code-block-start:");
    if (codeBlockStartIndex > -1) {
      range[0] = {
        line: index,
        column: codeBlockStartIndex,
      };
      inCodeBlock = true;
      let starterCodeLines = [];
      let finalCodeLines = [];

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

      output.info("****", codeLine, id);
      if (id.indexOf(" ") > -1) {
        output.warning("The {id} of this code block contains spaces:", id);
      }

      for (; nextCodeLine != undefined; ++counter) {
        nextCodeLine = input[counter];
        if (nextCodeLine == undefined) {
          output.error(
            `I expected a ':code-block-end:' but didn't find one.\n,
          This is the last code block I was working on at line ${counter}`
          );
          throw new Error(`I expected a ':code-block-end:' but didn't find one.\n,
          This is the last code block I was working on at line ${counter}`);
        }
        const codeBlockEndIndex = nextCodeLine.indexOf(":code-block-end:");
        if (nextCodeLine.indexOf(":hide-start:") > -1) {
          final = true;
          starter = false;
          continue;
        } else if (nextCodeLine.indexOf(":hide-end:") > -1) {
          starter = true;
          final = true;
          continue;
        } else if (nextCodeLine.indexOf(":replace-with:") > -1) {
          final = false;
          starter = true;
          continue;
        } else if (codeBlockEndIndex > -1) {
          range[1] = {
            line: counter,
            column: codeBlockEndIndex + ":code-block-end:".length + 1,
          };
          emitCodeBlock({
            id,
            source: starterCodeLines,
            stage: "start",
          });
          emitCodeBlock({
            id,
            source: finalCodeLines,
            stage: "final",
          });
          break;
        }

        if (starter) {
          starterCodeLines.push(nextCodeLine);
        }
        if (final) {
          finalCodeLines.push(nextCodeLine);
        }
      }

      result.push({
        id: id,
        startCode: starterCodeLines,
        finalCode: finalCodeLines,
        props: codeBlockProps,
        range,
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
  });
  return result;
}

exports.getCodeBlocks = getCodeBlocks;
