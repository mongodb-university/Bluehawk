import { CommandResult, Command, CommandConfig } from "./Processor";
import { strict as assert } from "assert";
import { CommandNode } from "../parser/CommandNode";
import { writeFile } from "fs";
import { basename, join } from "path";

interface SnippetConfig extends CommandConfig {
  writeFileMode: boolean;
  fileOutPath: string;
}
export default class SnippetCommand extends Command {
  config: SnippetConfig;
  constructor(config: SnippetConfig) {
    super(config);
    this.writeSnippet = this.writeSnippet.bind(this);
  }
  writeSnippet(filePath: string, contents: string, id: string): void {
    if (!this.config.writeFileMode) {
      return;
    }
    const fileName = basename(filePath);
    const newPath = join(
      this.config.fileOutPath,
      "bluehawk",
      "snippets",
      `${id}.snippet.${fileName}`
    );
    writeFile(newPath, contents, { flag: "w+" }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  process(command: CommandNode): CommandResult {
    assert(command.content);
    this.writeSnippet(command.source.filePath, command.content, command.id);
    return {
      range: {
        start: command.range.start.offset,
        end: command.range.end.offset,
      },
      result: command.content,
    };
  }
}
