const output = require("./output");
const constants = require("./constants");

let result = [];
let source=[];
let codeBlocks=[];
let fileType;

async function buildFileForStage(stage, code, type) {
  result = [];
  codeBlocks = code;
  fileType = type;
  
  return new Promise(async (resolve, reject) => {
    switch (stage){
      case "start":
        resolve(buildStarterCode());
        break;
      case "final":
        resolve(buildFinalCode());
        break;
      default:
        reject();
    }
  });
}

async function buildStarterCode() {
  let result =[]
  output.result('starter code')
  return new Promise(async (resolve, reject) => {
    for (c=0;c<codeBlocks.length;c++){
      let codeBlock = codeBlocks[c].startCode;
      if (codeBlock) {
        result.push(codeBlock.join('\n'));
      }
      result.push('\n');
    }
    output.result("STARTER codeblock", JSON.stringify(result))
    resolve(result);
  });
}

async function buildFinalCode() {
  let result =[]
  output.result('final code')
  return new Promise(async (resolve, reject) => {
    for (c=0;c<codeBlocks.length;c++){
      let codeBlock = codeBlocks[c].endCode;
      if (codeBlock) {
        result.push(codeBlock.join('\n'));
      }
      result.push('\n');
    }
    output.result("END codeblock", JSON.stringify(result))
    resolve(result);
  });
}

exports.buildFileForStage = buildFileForStage;
