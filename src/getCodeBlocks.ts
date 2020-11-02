import { MessageHandler } from "./messageHandler";
const output = MessageHandler.getMessageHandler();

export function getMinIndentation(lines: string[]): number {
  return (
    lines.reduce((acc: number, cur: string) => {
      const lengthWithoutIndent = cur.trimStart().length;
      if (lengthWithoutIndent === 0) {
        return acc;
      }
      const indentLength = cur.length - lengthWithoutIndent;
      if (acc == null) {
        return indentLength;
      }
      return Math.min(acc, indentLength);
    }, null) || 0
  );
}

export function deindentLines(lines: string[], amount: number): string[] {
  return lines.map((line) => line.slice(amount));
}

interface EmitCodeFn {
  id: string;
  source: string[];
  stage: string;
}

export function getCodeBlocks({
  input,
  emitCodeBlock,
}: {
  input: string[];
  emitCodeBlock: ({ id, source, stage }: EmitCodeFn) => void;
}): Record<string, string>[] {
  const result = [];
  let starter = true;
  let final = true;
  const codeBlockProps: Record<string, string> = {};
  let inCodeBlock = false;

  input.forEach((codeLine: string, index: number) => {
    let id;
    let counter = index + 1;
    let nextCodeLine = input[counter];

    // Range has two elements: begin and end, which each have line and column
    const range = [{}, {}];
    const codeBlockStartIndex = codeLine.indexOf(":code-block-start:");
    if (codeBlockStartIndex > -1) {
      range[0] = {
        line: index,
        column: codeBlockStartIndex,
      };
      inCodeBlock = true;
      const starterCodeLines = [];
      const finalCodeLines = [];

      if (codeLine.indexOf("{") > -1) {
        //we have a property object
        id = codeBlockProps.id.trim();
        while (nextCodeLine.indexOf("}") == -1) {
          counter++;
          nextCodeLine = input[counter];
        }
        counter++;
      } else {
        const matchAll = Array.from(codeLine.matchAll(/:/g));
        id = codeLine
          .substring(matchAll[matchAll.length - 1].index + 1)
          .replace("*/", "")
          .trim();
      }

      output.addInformational("****", codeLine, id);
      if (id.indexOf(" ") > -1) {
        output.addWarning("The {id} of this code block contains spaces:", id);
      }

      for (; nextCodeLine != undefined; ++counter) {
        nextCodeLine = input[counter];
        if (nextCodeLine == undefined) {
          output.addError(
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
            source: deindentLines(
              starterCodeLines,
              getMinIndentation(starterCodeLines)
            ),
            stage: "start",
          });
          emitCodeBlock({
            id,
            source: deindentLines(
              finalCodeLines,
              getMinIndentation(finalCodeLines)
            ),
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
      output.addError(
        `I found a 'hide' command outside of a code block at line ${counter}.`,
        codeLine
      );
    }
  });
  return result;
}
