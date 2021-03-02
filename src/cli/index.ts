#!/usr/bin/env node
export * from "./Plugin";
export * from "./cli";
export * from "./commands";
export * from "./options";
export * from "./printJsonResult";

import { run } from "./cli";

run().catch((err) => {
  console.error(err);
});
