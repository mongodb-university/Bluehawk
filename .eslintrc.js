module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaVersion: 8,
  },
  root: true,
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      files: ["js-test/*.js"],
      env: {
        mocha: true,
      },
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
    },
  ],
  ignorePatterns: ["**/build/*"],
};
