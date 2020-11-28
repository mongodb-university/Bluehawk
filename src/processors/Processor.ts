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

export type Listener = (event: any) => void;

export abstract class Command {
  config: CommandConfig;
  commandName: string;
  constructor(config: CommandConfig) {
    this.commandName = config.commandName;
    this.config = config;
    this.process = this.process.bind(this);
  }
  abstract process(command: CommandNode): CommandResult;
}

/**
 * TODO
 *
 * Processor needs to be refacotored so that it doesn't perform the reduce. It should simply pass the root CommandNode tree to each registered Command
 * that is configured to process a tree (which implies a small command refactor to signify this).
 *
 * Commands should look for other registered commands on this processor in the commands map and invoke them. No side effects should happen from commands (file writing),
 * instead they need to use the Processor's publish method to notify any subscribers of an encountered event. There will need to be subscribers for snippets and states.
 */

export default class Processor {
  private static commands: Record<string, CommandProcessor> = {};
  private static listeners: Listener[] = [];

  static publish(event: any): void {
    this.listeners.forEach((listener) => listener(event));
  }

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
    this.commands[command.commandName] = command.process;
  }

  static subscribe(listener: Listener) {
    this.listeners.push(listener);
  }
}
