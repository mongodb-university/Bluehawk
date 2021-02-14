module.exports = {
  preset: "ts-jest",
  testRegex: "\\.test\\.ts$",
  testEnvironment: "node",
  collectCoverage: true,
  coverageReporters: ["text", "html"],
  coverageDirectory: "<rootDir>/coverage",
  modulePathIgnorePatterns: ["<rootDir>/build"],
};
