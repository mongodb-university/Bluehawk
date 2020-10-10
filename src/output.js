const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

let warningsList = [];
let errorsList = [];

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

module.exports.warning = function (...text) {
  console.log(chalk.hex("#FFFF00")("\n⚠️\t" + text.join("\t") + "\n"));
  warningsList.push(text);
};

module.exports.error = function (...text) {
  console.log(chalk.hex("#FF0000")("\n❗\t" + text.join("\t") + "\n"));
  errorsList.push(text);
};

module.exports.important = function (...text) {
  console.log(chalk.hex("#FFFF00")("\n⚠️\t" + text.join("\t") + "\n"));
};

module.exports.info = function (...text) {
  console.log(chalk.cyanBright(text.join(" ") + "\n"));
};

exports.warningsList = warningsList;
exports.errorsList = errorsList;
