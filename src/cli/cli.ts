import * as yargs from "yargs";

export async function run(): Promise<void> {
  yargs
    .commandDir("commands", {
      extensions:
        process.env.NODE_ENV === "development" ? ["js", "ts"] : ["js"],
      exclude: /\.test\.[jt]s$/,
      visit(commandModule) {
        return commandModule.default;
      },
    })
    .demandCommand()
    .help().argv;
}
