import { ActionReporter, LogLevel } from "./ActionReporter";
import { Document } from "./../Document";
import { ConsoleActionReporter } from "./ConsoleActionReporter";

const dummyReport = (reporter: ActionReporter) => {
  reporter.onBinaryFile({
    sourcePath: "test",
  });
  reporter.onBluehawkErrors({
    sourcePath: "test",
    errors: [],
  });
  reporter.onFileError({
    sourcePath: "test",
    error: new Error(),
  });
  reporter.onFileParsed({
    sourcePath: "foo",
    parseResult: {
      errors: [],
      source: {} as Document,
      tagNodes: [],
    },
  });
  reporter.onFileWritten({
    destinationPath: "foo",
    sourcePath: "bar",
    type: "text",
  });
  reporter.onIdsUnused({
    ids: [],
    paths: [],
  });
  reporter.onParserNotFound({
    error: new Error(),
    sourcePath: "test",
  });
  reporter.onStateNotFound({
    paths: [],
    state: "foo",
  });
  reporter.onStatesFound({
    action: "",
    paths: [],
    statesFound: [],
  });
  reporter.onWriteFailed({
    type: "text",
    destinationPath: "foo",
    sourcePath: "bar",
    error: new Error(),
  });
};

class ConsoleCounter {
  log = 0;
  warn = 0;
  error = 0;

  constructor() {
    console.log = () => {
      ++this.log;
    };
    console.warn = () => {
      ++this.warn;
    };
    console.error = () => {
      ++this.error;
    };
  }
}

describe("ConsoleActionReporter", () => {
  const originalConsole = { ...console };
  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  it("allows log level setting", () => {
    const reporter = new ConsoleActionReporter();

    let counter = new ConsoleCounter();
    reporter.logLevel = LogLevel.Info;
    dummyReport(reporter);
    expect(counter.log).toBeGreaterThan(0);
    expect(counter.warn).toBeGreaterThan(0);
    expect(counter.error).toBeGreaterThan(0);

    counter = new ConsoleCounter();
    reporter.logLevel = LogLevel.Warning;
    dummyReport(reporter);
    expect(counter.log).toBe(0);
    expect(counter.warn).toBeGreaterThan(0);
    expect(counter.error).toBeGreaterThan(0);

    counter = new ConsoleCounter();
    reporter.logLevel = LogLevel.Error;
    dummyReport(reporter);
    expect(counter.log).toBe(0);
    expect(counter.warn).toBe(0);
    expect(counter.error).toBeGreaterThan(0);

    counter = new ConsoleCounter();
    reporter.logLevel = LogLevel.None;
    dummyReport(reporter);
    expect(counter.log).toBe(0);
    expect(counter.warn).toBe(0);
    expect(counter.error).toBe(0);
  });
});
