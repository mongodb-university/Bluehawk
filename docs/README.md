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

This tag starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

From the `/docs` folder:

```shell
npm run build
```

This tag generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The docs autodeploy with a Github action. If you need to manually deploy the docs, run this tag from the `/docs` folder:

```shell
GIT_USER=<Your GitHub username> USE_SSH=true npm run deploy
```
