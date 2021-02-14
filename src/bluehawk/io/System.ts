/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
import fs from "fs";
import { fs as memfs } from "memfs";

// Mockable fs implementation. Use this instead of fs directly.
export const System = {
  fs: fs.promises,

  useMemfs() {
    // You can use this in a jest file like so:
    /*
    beforeAll(System.useMemfs);
    afterAll(System.useRealfs);
    */
    System.fs = (memfs.promises as unknown) as typeof fs.promises;
  },

  useRealfs() {
    System.fs = fs.promises;
  },
};
