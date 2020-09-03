const Realm = require("realm");
const inquirer = require("inquirer");
const users = require("./users");
const schemas = require("./schemas");
const output = require("../output");

Realm.Sync.setLogLevel("error");

let realm;
async function openRealm() {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      // This comment should be in both outputs.
      // There are 3 codeblocks that follow, each testing a different
      // way to comment.

      // :code-block-start:openRealm1
      // :hide-start:

      notInStartCode: true,
      inFinalCode: true,

      // :replace-with:
      // // You should only see this in the start code
      // start: true,
      // final: false,
      // // comment in start code: ... ,
      // :hide-end:
      // :code-block-end:

      /* :code-block-start: openRealm2 
      :hide-start:*/
      notInStartCode: true,
      inFinalCode: true,
      /* :replace-with:
      // You should only see this in the start code
      start: true,
      final: false,
      // comment in start code: ... ,
      :hide-end:
      :code-block-end:*/

      // :code-block-start: openRealm3
      // :hide-start:
      notInStartCode: true,
      inFinalCode: true,
      /* :replace-with:
       // You should only see this in the start code
       start: true,
       final: false,
       // comment in start code: ... ,
       :hide-end:
       :code-block-end:
       */
    },
  };
  realm = Realm.open(config);
}

output.intro();

async function run() {
  console.log("*** WELCOME ***");
  console.log(
    "Please log in to your Realm account or register as a new user."
  );

  let choice = await inquirer.prompt([
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
  }
}

run().catch((err) => {
  output.error(err.message);
});

async function getRealm() {
  if (realm == undefined) {
    await openRealm();
  }
  return realm;
}

async function closeRealm() {
  if (realm != undefined) {
    realm.close();
    realm = undefined;
  }
}

exports.getRealm = getRealm;
exports.closeRealm = closeRealm;
exports.run = run;
