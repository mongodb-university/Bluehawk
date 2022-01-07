---
id: "plugins"
title: "Plugins"
sidebar_label: "Plugins"
sidebar_position: 4
custom_edit_url: null
---

You can add commands and listeners by creating a JS file or node project that
implements the register() function:

```js
// myPlugin.js
exports.register = (bluehawk) => {
  // Register a new command, :my-command:
  bluehawk.registerCommand("my-command", {
    rules: [],
    process: (request) => {
      // Execute command
    },
  });

  // Register a document listener
  bluehawk.subscribe((finishedDocument) => {
    // Do something with finishedDocument
  });
};
```

Usage:

```shell
bluehawk --plugin ./myPlugin source.txt
```

You can pass the --plugin flag multiple times to load different plugins or create a plugin that is composed of other plugins.
