import chalk from "chalk";

export const warningsList = [];
export const errorsList = [];

export function warning(...text: string[]): void {
  console.warn(chalk.hex("#FFFF00")("\n⚠️\t" + text.join("\t") + "\n"));
  warningsList.push(text);
}

export function error(...text: string[]): void {
  console.error(chalk.hex("#FF0000")("\n❗\t" + text.join("\t") + "\n"));
  errorsList.push(text);
}

export function important(...text: string[]): void {
  console.log(chalk.hex("#FFFF00")("\n⚠️\t" + text.join("\t") + "\n"));
}

export function info(...text: string[]): void {
  console.info(chalk.cyanBright(text.join(" ") + "\n"));
}
