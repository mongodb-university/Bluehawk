import { CommandResult, Command, CommandConfig } from "./Processor";
import { strict as assert } from "assert";
import { CommandNode } from "../parser/CommandNode";

/**
 * SnippetProcessor has the side effect of writing snippet files
 */

export default class RemoveCommand extends Command {
  fileOutPath: string;
  constructor(cfg: CommandConfig) {
    super(cfg);
  }

  process(command: CommandNode): CommandResult {
    assert(command.content);
    return {
      range: {
        start: command.range.start.offset,
        end: command.range.end.offset,
      },
      result: "",
    };
  }
}
