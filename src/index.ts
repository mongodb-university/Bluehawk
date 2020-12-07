import * as yargs from "yargs";
import { MessageHandler } from "./messageHandler";
import * as fileHandler from "./fileHandler";
import * as bhp from "./fs/parseSource";

const output = MessageHandler.getMessageHandler();

async function run(): Promise<void> {
  const params = yargs
    .usage("Usage: $0 <command> [options]")
    .command("--source", "The file or folder to process")
    .command("--destination", "The output folder")
    .command("--ignores", "A glob list of patterns to ignore")
    .example(
      "$0 -s ./foo.js -d ./output/",
      "Parse the foo.js file and output results in the output/ directory."
    )
    .alias("s", "source")
    .alias("d", "destination")
    .alias("i", "ignores")
    .demandOption(["source"])
    .help("h")
    .alias("h", "help").argv;

  let ignores: string[];
  if (typeof params.ignores == "string") {
    ignores = (params.ignores as string).split(",");
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
  const destination = params.destination as string;
  await bhp.main(source, ignores);
}

run().catch((err) => {
  output.addError(err);
});

export default run;
