/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
import {
  promises as fs,
  constants as fsConstants,
  Stats,
  MakeDirectoryOptions,
  PathLike,
  WriteFileOptions,
} from "fs";

// Mockable async fs standin. CLI commands should use this instead of the fs
// library directly.
export interface FileSystem {
  copyFile(src: PathLike, dest: PathLike, flags?: number): Promise<void>;

  lstat(path: PathLike): Promise<Stats>;

  mkdir(
    path: PathLike,
    options?: number | string | MakeDirectoryOptions | undefined | null
  ): Promise<void>;

  readdir(
    path: PathLike,
    options?:
      | { encoding?: BufferEncoding | null; withFileTypes?: false }
      | BufferEncoding
      | null
  ): Promise<string[]>;

  readFile(
    path: PathLike,
    options:
      | { encoding: BufferEncoding; flag?: string | number }
      | BufferEncoding
  ): Promise<string>;

  writeFile(
    path: PathLike | fs.FileHandle,
    data: any,
    options?: WriteFileOptions
  ): Promise<void>;

  // Declare more functionality from fs here as needed.
  // Use signatures from fs.promises.
}

// The system instance to be used by CLI commands.
export const System = {
  fsConstants,

  // override this to mock
  fs: fs as FileSystem,
};
