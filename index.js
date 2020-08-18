const inquirer = require("inquirer");
const output = require("./output");
const fileHandler = require("./fileHandler");
const yargs = require("yargs");

output.intro();
var params = {};

async function run() {
  params = yargs
    //const argv = require('yargs')
    .usage("Usage: $0 <command> [options]")
    .command("source", "The file or folder to process")
    .command("type", "The file type to process")
    .command("destination", "The output folder")
    .command("stages", "The code stages to build, as comma-delimited list")
    .example("$0 count -f foo.js", "count the lines in the given file")
    .alias("s", "source")
    .alias("t", "type")
    .alias("d", "destination")
    //.nargs('f', 1)
    .describe("s", "The file or folder to process")
    .demandOption(["s"])
    .help("h")
    .alias("h", "help").argv;
  /*.command('source', 'The file or folder to process', {
      source: {
         description: 'The file or folder to process',
         alias: 's',
         type: 'string',
      },
      type: {
         description: 'The file type to process',
         alias: 't',
         type: 'string',
   }
   })
   .command('type', 'The file type to process', {
      type: {
            description: 'The file type to process',
            alias: 't',
            type: 'string',
      }
   })
   .command('destination', 'The output folder', {
      destination: {
         description: 'The output folder',
         alias: 'd',
         type: 'string',
      }
   })
   .help()
   .alias('help', 'h')
   .argv;*/

  console.log(params);

  //TODO: user can specify what to generate (starter code, final code, steps)
  //default should be all 3

  //TODO: if no parameters were passed in, prompt for the needfulness
  //if (myArgs.length)

  /*let choice = await inquirer.prompt([
    {
      type: "rawlist",
      name: "start",
      message: "What do you want to do?",
      choices: ["Log in", "Register as a new user"],
    },
  ]);

  if (choice.start === "Log in") {
    users.logIn();
  } else {
    users.registerUser();
  }*/

  fileHandler.openFile(params);
}

run().catch((err) => {
  output.error(err);
});

exports.run = run;
