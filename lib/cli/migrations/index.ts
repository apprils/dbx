import nopt from "nopt";
import fsx from "fs-extra";

import { resolvePath, run } from "../base";
import createMigration from "./create";
import generateKnexfile from "./knexfile";

import type { MigrationsConfig } from "../@types";

const { config: configFile, action } = nopt(
  {
    config: String,
    action: String,
  },
  {
    c: ["--config"],
    a: ["--action"],
  },
);

run(async () => {
  if (!(await fsx.pathExists(configFile))) {
    throw new Error(`Config file does not exists: ${configFile}`);
  }

  const config: MigrationsConfig = require(resolvePath(configFile)).default;

  for (const requiredParam of [
    "connection",
    "client",
    "base",
    "migrationDir",
  ] as const) {
    if (!config[requiredParam]) {
      throw new Error(
        `Incomplete config provided, ${requiredParam} param missing`,
      );
    }
  }

  if (action === "create") {
    await createMigration(config);
    return;
  }

  if (action === "knexfile") {
    await generateKnexfile(config);
    return;
  }

  throw new Error(`Unknown action: ${action}`);
});
