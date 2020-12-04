import { assert } from "console";
import { setServers } from "dns";
import { MarkupContent } from "../../node_modules/vscode-languageserver/lib/main";
import { BluehawkResult, Bluehawk } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";
import Processor, {
  ProcessCommandResult,
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

      let processorResult;
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
    if (!this.states) {
      this.states = new Set();
      this.findStates(bhr);
    }

    for (const state of this.states) {
      const processedResults = this.processCommands(bhr, bluehawk, state);
      Processor.publish({
        event: this.commandName,
        state,
        path: bhr.source.filePath,
        content: processedResults,
      });
    }
  }

  findStates({ commands }: BluehawkResult): void {
    commands.forEach((command) => {
      if (command.commandName == this.commandName) {
        this.states.add(command.id);
      }
    });
  }

  processState(
    state: string,
    command: CommandNode,
    bhr: BluehawkResult,
    bluehawk: Bluehawk
  ): ParseCommandResult {
    assert(command.content);
    let result;

    if (command.attributes.id != state) {
      result = "";
    } else {
      if (command.children.length > 0) {
        const newNodes = bluehawk.run({ ...bhr.source, text: command.content });
        result = this.processCommands(newNodes, bluehawk, state);
      } else {
        result = command.content;
      }
    }
    return {
      range: {
        start: command.range.start.offset,
        end: command.range.end.offset,
      },
      result,
    };
  }
}

// export default class StateCommandProcessor extends ProcessCommand {
//   process(
//     state: string,
//     { commands, source }: BluehawkResult,
//     bluehawk: Bluehawk
//   ): ProcessCommandResult {
//     return commands.reduce((acc, curr) => {
//       if (commands[curr.commandName]) {
//         if (curr.children.length > 0) {
//           acc = this.process(
//             state,
//             { errors: [], commands: curr.children, source },
//             bluehawk
//           ) as string;
//         }
//         const newCommand = bluehawk
//           .run({ ...source, text: acc })
//           .commands.shift();
//         const processorResult = commands[newCommand.commandName](newCommand);
//         return (
//           acc.slice(0, processorResult.range.start) +
//           processorResult.result +
//           acc.slice(processorResult.range.end)
//         );
//       }
//       return acc;
//     }, source.text);
//   }
// }

/**
 * TODO
 *
 * Processor needs to be refacotored so that it doesn't perform the reduce. It should simply pass the root CommandNode tree to each registered Command
 * that is configured to process a tree (which implies a small command refactor to signify this).
 *
 * Commands should look for other registered commands on this processor in the commands map and invoke them. No side effects should happen from commands (file writing),
 * instead they need to use the Processor's publish method to notify any subscribers of an encountered event. There will need to be subscribers for snippets and states.
 */
