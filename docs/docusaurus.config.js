// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Bluehawk",
  tagline: "Markup processor for extracting and manipulating code",
  url: "https://mongodb-university.github.io",
  baseUrl: "/Bluehawk/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  organizationName: "mongodb-university", // Usually your GitHub org/user name.
  projectName: "Bluehawk", // Usually your repo name.
  plugins: [
    [
      "docusaurus-plugin-typedoc",

      // Plugin / TypeDoc options
      {
        entryPoints: ["../src/index.ts"],
        tsconfig: "../tsconfig.json",
        out: "develop/api",
      },
    ],
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          // Please change this to your repo.
          editUrl:
            "https://github.com/mongodb-university/Bluehawk/blob/main/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Bluehawk Docs",
        items: [
          {
            href: "https://github.com/mongodb-university/Bluehawk",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Intro",
                to: "/",
              },
              {
                label: "Tags",
                to: "/commands",
              },
              {
                label: "CLI",
                to: "/cli",
              },
              {
                label: "API",
                to: "api",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Github Repo",
                href: "https://github.com/mongodb-university/Bluehawk",
              },
              {
                label: "Contributing Guidelines",
                href: "https://github.com/mongodb-university/Bluehawk/blob/main/CONTRIBUTING.md",
              },
              {
                label: "Submit Issue",
                href: "https://github.com/mongodb-university/Bluehawk/issues",
              },
            ],
          },
        ],
      },
      prism: {
        additionalLanguages: ["java", "swift"],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
