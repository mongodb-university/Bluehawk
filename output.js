const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

module.exports.intro = function () {
  clear();
  console.log(
    chalk.blueBright.bold(
      figlet.textSync("Bluehawk", {
        font: "colossal",
      })
    )
  );
};

module.exports.header = function (...text) {
  console.log(chalk.yellowBright.bold("\n" + text.join(" ") + "\n"));
};

module.exports.error = function (...text) {
  console.log(chalk.red.bold("\n ❗\n" + text.join(" ") + "\n ❗\n"));
};

module.exports.result = function (...text) {
  console.log(chalk.yellowBright(text.join(" ") + "\n"));
};
