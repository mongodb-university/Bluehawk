import { BluehawkResult, Bluehawk } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";

export type CommandProcessor = (...input: any) => any;
export interface CommandConfig {
  commandName: string;
}

export interface ParseCommandResult {
  range: {
    start: number;
    end: number;
  };
  result: string;
}

export type ProcessCommandResult = string;

export type Listener = (event: any) => void;

abstract class Command {
  config: CommandConfig;
  commandName: string;
  constructor(config: CommandConfig) {
    this.commandName = config.commandName;
    this.config = config;
  }
  abstract process(...unknown: any): unknown;
}
export abstract class ProcessCommand extends Command {
  constructor(config: CommandConfig) {
    super(config);
    this.process = this.process.bind(this);
  }
  abstract process(nodes: BluehawkResult, bluehawk: Bluehawk): void;
}
export abstract class ParseCommand extends Command {
  constructor(config: CommandConfig) {
    super(config);
    this.process = this.process.bind(this);
  }
  abstract process(command: CommandNode): ParseCommandResult;
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
  static commands: Record<string, CommandProcessor> = {};
  static listeners: Listener[] = [];

  static publish(event: any): void {
    this.listeners.forEach((listener) => listener(event));
  }

  static process(
    { commands, source }: BluehawkResult,
    bluehawk: Bluehawk
  ): string {
    // todo
    return "todo";
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
