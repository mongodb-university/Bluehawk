import * as path from "path";
import { Bluehawk } from ".";

export async function loadPlugin(
  pluginPath: string,
  bluehawk: Bluehawk
): Promise<string> {
  // Convert relative path (from user's cwd) to absolute path -- as import()
  // expects relative paths from Bluehawk bin directory
  const absolutePath = path.isAbsolute(pluginPath)
    ? pluginPath
    : path.resolve(process.cwd(), pluginPath);
  const plugin = await import(absolutePath);
  plugin.register(bluehawk);
  return absolutePath;
}
