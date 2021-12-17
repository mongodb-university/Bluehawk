# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a documentation-focused static website generator.

The website also uses the plugin [docusaurus-plugin-typedoc](https://www.npmjs.com/package/docusaurus-plugin-typedoc)
to generate the reference documentation in the `docs/api` directory.

## Installation

From the root of the Bluehawk repo:

```shell
npm install
cd docs
npm install
```

## Local Development

From the `/docs` folder:

```shell
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### IMPORTANT NOE FOR FIRST BUILD

The first time you run the project, you'll run into an issue
where the project doesn't build correctly. The error looks like:

```
SyntaxError: /Users/ben.p/projects/Bluehawk/docs/docs/api/classes/RootParser.md: Expected corresponding JSX closing tag for <tokType>. (298:74)
  296 | In EBNF terms this is equivalent to a Terminal.`}</p>
  297 | <p>{`A Token will be consumed, IFF the next token in the token vector matches `}<tokType>{`.
> 298 | otherwise the parser may attempt to perform error recovery (if enabled).`}</p>
      |                                                                           ^
  299 | <p>{`The index in the method name indicates the unique occurrence of a terminal consumption
  300 | inside a the top level rule. What this means is that if a terminal appears
  301 | more than once in a single rule, each appearance must have a `}<strong parentName="p">{`different`}</strong>{` index.`}</p>
client (webpack 5.64.4) compiled with 1 error
```

This issue occurs because the docusaurus-plugin-typedoc parser has trouble with
a code annotation included in an imported package.

You can fix this by:

1. going to the file in the Bluehawk repo: `/node_modules/chevrotain/lib/chevrotain.d.ts`.
   (_Note_: This is the `node_modules` folder in the root of the Bluehawk repo, not in the `/docs` directory.)
2. On line 158, change `<tokType>` to `"tokType"`.
3. Rerun `npm start` and the docs should render as expected.

## Build

```shell
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

```shell
GIT_USER=<Your GitHub username> USE_SSH=true npm run deploy
```
