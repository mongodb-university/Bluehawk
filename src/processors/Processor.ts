import { BluehawkResult, Bluehawk } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";

export type CommandProcessor = (input: CommandNode) => CommandResult;
export interface CommandConfig {
  commandName: string;
}

export interface CommandResult {
  range: {
    start: number;
    end: number;
  };
  result: string;
}

export abstract class Command {
  config: CommandConfig;
  constructor(config: CommandConfig) {
    this.config = config;
    this.process = this.process.bind(this);
  }
  abstract process(command: CommandNode): CommandResult;
}

export default class Processor {
  private static commands: Record<string, CommandProcessor> = {};

  static process(
    { commands, source }: BluehawkResult,
    bluehawk: Bluehawk
  ): string {
    return commands.reduce((acc, curr) => {
      if (this.commands[curr.commandName]) {
        if (curr.children.length > 0) {
          acc = this.process(
            { errors: [], commands: curr.children, source },
            bluehawk
          );
        }
        const newCommand = bluehawk
          .run({ ...source, text: acc })
          .commands.shift();
        const processorResult = this.commands[newCommand.commandName](
          newCommand
        );
        return (
          acc.slice(0, processorResult.range.start) +
          processorResult.result +
          acc.slice(processorResult.range.end)
        );
      }
      return acc;
    }, source.text);
  }

  /**
   *
   * @param command - The Command to register.
   */
  static registerCommand(command: Command): void {
    this.commands[command.config.commandName] = command.process;
  }
}
