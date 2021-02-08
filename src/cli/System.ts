/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
import {
  promises as fs,
  Stats,
  MakeDirectoryOptions,
  PathLike,
  WriteFileOptions,
} from "fs";

// Mockable async fs standin. CLI commands should use this instead of the fs
// library directly.
export interface FileSystem {
  writeFile: (
    path: PathLike | fs.FileHandle,
    data: any,
    options?: WriteFileOptions
  ) => Promise<void>;

  mkdir: (
    path: PathLike,
    options?: number | string | MakeDirectoryOptions | undefined | null
  ) => Promise<void>;

  copyFile: (src: PathLike, dest: PathLike, flags?: number) => Promise<void>;

  lstat: (path: PathLike) => Promise<Stats>;

  // Declare more functionality from fs here as needed.
  // Use signatures from fs.promises.
}

// The system instance to be used by CLI commands.
export const System = {
  // override this to mock
  fs: fs as FileSystem,
};
