var rimraf = require("rimraf");
var fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "/output");
const filer = require("../build/fileHandler");

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

    const sources = [
      "./js-test/input/comments.js",
      "./js-test/input/codefile.js",
      "./js-test/input/badcodefile.js",
      "./js-test/input/indent.c",
      "./js-test/input/firstBlockNotHidden.swift",
      "./js-test/input/stepfilewithcode.js",
    ];

    const promises = sources.map((source) =>
      filer.openFile({ ...params, source })
    );

    await Promise.all(promises);
  },

  afterAll(done) {
    console.log("deleting", dirPath);
    rimraf.sync(dirPath);
    done();
  },
};
