import * as yargs from "yargs";
import { MessageHandler } from "./messageHandler";
import * as fileHandler from "./fileHandler";

const output = MessageHandler.getMessageHandler();

async function run(): Promise<void> {
  const params = yargs
    .usage("Usage: $0 <command> [options]")
    .command("--source", "The file or folder to process")
    .command("--destination", "The output folder")
    .example(
      "$0 -s ./foo.js -d ./output/",
      "Parse the foo.js file and output results in the output/ directory."
    )
    .alias("s", "source")
    .alias("d", "destination")
    .demandOption(["source"])
    .help("h")
    .alias("h", "help").argv;

  if (params.stages instanceof String) {
    params.stages = params.stages.split(",");
  }

  if (!params.type) {
    params.type = fileHandler.getFileType(params.source as string);
    output.addImportant(
      "I have auto-detected a file type of '" +
        params.type +
        "'. If this is incorrect, \nuse the --t or -type parameter to specify " +
        "the correct file type."
    );
  }

  const source = params.source as string;
  const stages = params.stages as [string];
  const destination = params.destination as string;
  const type = params.type as string;

  fileHandler.openFile({
    source,
    stages,
    destination,
    type,
  });
}

run().catch((err) => {
  output.addError(err);
});

export default run;
