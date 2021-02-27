/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
import fs from "fs";
import { createFsFromVolume, DirectoryJSON, Volume } from "memfs";

// Mockable fs implementation. Use this instead of fs directly.
export const System = {
  fs: fs.promises,

  // You can use this in a jest file like so:
  /*
    beforeEach(System.useMemfs);
  */
  useMemfs() {
    // Use an empty fs so the state is not retained between test files
    System.useJsonFs({});
  },

  // You can use this in a jest test like so:
  /*
    System.useJsonFs({
      "/path/to/foo.txt": "this is the content of foo.txt"
    })
  */
  useJsonFs(directoryJson: DirectoryJSON) {
    const fsFromVolume = createFsFromVolume(Volume.fromJSON(directoryJson));
    System.fs = (fsFromVolume.promises as unknown) as typeof fs.promises;
  },

  useRealfs() {
    System.fs = fs.promises;
  },
};
