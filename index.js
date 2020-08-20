const inquirer = require("inquirer");
const output = require("./output");
const fileHandler = require("./fileHandler");
const yargs = require("yargs");

output.intro();
var params = {};

async function run() {
  params = yargs
    .usage("Usage: $0 <command> [options]")
    .command("source", "The file or folder to process")
    .command("type", "The file type to process")
    .command("destination", "The output folder")
    .command("stages", "The code stages to build, as comma-delimited list")
    .example("$0 count -f foo.js", "TODO")
    .alias("s", "source")
    .alias("t", "type")
    .alias("d", "destination")
    //.nargs('f', 1)
    .demandOption(["source"])
    .help("h")
    .alias("h", "help").argv;

  //console.log(params);

  //TODO: user can specify what to generate (starter code, final code, steps)
  //default should be all 3

  if (!params.stages) {
    params.stages = ["start", "final"];
  }
  if (!Array.isArray(params.stages)) {
    output.error(params.stages);
    params.stages = params.stages.split(",");
  }
  if (!params.type) {
    params.type = await fileHandler.getFileType(params.source);
  }

  fileHandler.openFile(params);
}

run().catch((err) => {
  output.error(err);
});

exports.run = run;
