import { assert } from "console";
import { BluehawkResult, Bluehawk } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";
import Processor, {
  ProcessCommand,
  CommandConfig,
  ParseCommandResult,
} from "./Processor";

export default class StateCommandProcessor extends ProcessCommand {
  states: Set<string>;
  baseProcessor: Processor;
  constructor(config: CommandConfig) {
    super(config);
    this.process = this.process.bind(this);
    this.processState = this.processState.bind(this);
    this.findStates = this.findStates.bind(this);
    this.states = new Set();
  }

  processCommands(
    bhr: BluehawkResult,
    bluehawk: Bluehawk,
    state: string
  ): string {
    return bhr.commands.reduce((acc) => {
      const newCommand = bluehawk
        .run({ ...bhr.source, text: acc })
        .commands.shift();

      let processorResult: ParseCommandResult;
      if (newCommand.commandName == this.commandName) {
        processorResult = this.processState(state, newCommand, bhr, bluehawk);
      } else if (Processor.commands[newCommand.commandName]) {
        processorResult = Processor.commands[newCommand.commandName](
          newCommand
        );
      }
      acc =
        acc.slice(0, processorResult.range.start) +
        processorResult.result +
        acc.slice(processorResult.range.end);
      return acc;
    }, bhr.source.text);
  }

  process(bhr: BluehawkResult, bluehawk: Bluehawk): void {
    assert(bhr.commands);
    if (this.states.size > 0) {
      for (const state of this.states) {
        const processedResults = this.processCommands(bhr, bluehawk, state);
        Processor.publish({
          event: this.commandName,
          state,
          path: bhr.source.filePath,
          content: processedResults,
        });
      }
    } else {
      const processedResults = this.processCommands(bhr, bluehawk, "");
      Processor.publish({
        event: this.commandName,
        state: "",
        path: bhr.source.filePath,
        content: processedResults,
      });
    }
  }

  findStates({ commands }: BluehawkResult): Set<string> {
    commands.forEach((command) => {
      if (command.commandName == this.commandName) {
        this.states.add(command.id);
      }
    });
    return this.states;
  }

  processState(
    state: string,
    command: CommandNode,
    bhr: BluehawkResult,
    bluehawk: Bluehawk
  ): ParseCommandResult {
    assert(command.content);
    let result: string;

    if (command.attributes.id != state) {
      return {
        range: {
          start: command.range.start.offset,
          end: command.range.end.offset,
        },
        result: "",
      };
    } else {
      if (command.children.length > 0) {
        const newNodes = bluehawk.run({ ...bhr.source, text: command.content });
        result = this.processCommands(newNodes, bluehawk, state);
      } else {
        result = command.content;
      }
    }
    result = result
      .split("\n")
      .map(
        (line) =>
          line.slice(0, line.indexOf("/")) +
          line.slice(line.indexOf("/") + "// ".length)
      )
      .join("\n");
    // uncomment result
    return {
      range: {
        start: command.range.start.offset,
        end: command.range.end.offset,
      },
      result,
    };
  }
}
