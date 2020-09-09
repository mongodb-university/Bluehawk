var rimraf = require("rimraf");
var fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "/output");
const filer = require("../fileHandler");

exports.mochaHooks = {
  async beforeAll() {
    console.log("creating", dirPath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    const params = {
      source: "",
      stages: ["start", "final"],
      destination: dirPath,
      type: "js",
    };

    params.source = "./test/input/comments.js";
    await filer.openFile(params);
    params.source = "./test/input/codefile.js";
    await filer.openFile(params);
    params.source = "./test/input/badcodefile.js";
    await filer.openFile(params);
    params.source = "./test/input/indent.c";
    await filer.openFile(params);
    params.source = "./test/input/stepfilewithcode.js";
    await filer.openFile(params);
  },

  afterAll(done) {
    console.log("deleting", dirPath);
    rimraf.sync(dirPath);
    done();
  },
};
