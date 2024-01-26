
import nopt from "nopt";
import fsx from "fs-extra";
import pgts from "@appril/pgts";

import { resolvePath, run } from "../base";

import typesGenerator from "./types";
import tablesGenerator from "./tables";
import viewsGenerator from "./views";

import type { GeneratorConfig } from "../@types";

import { BANNER, renderToFile } from "../render";
import baseTpl from "./templates/base.tpl";

const {
  config: configFile,
} = nopt({
  config: String,
}, {
  c: [ "--config" ],
})

run(async () => {

  if (!await fsx.pathExists(configFile)) {
    throw new Error(`Config file does not exists: ${ configFile }`)
  }

  const config: GeneratorConfig = require(resolvePath(configFile)).default

  for (const requiredParam of [
    "connection",
    "base",
  ] as const) {
    if (!config[requiredParam]) {
      throw new Error(`Incomplete config provided, ${ requiredParam } param missing`)
    }
  }

  const {
    schemas,
    tables,
    views,
    enums,
  } = await pgts(config.connection, config)

  process.stdout.write(" 🡺 Generating types... ")
  await typesGenerator(config, { schemas, tables, views, enums })
  console.log("Done ✨")

  process.stdout.write(" 🡺 Generating tables... ")
  await tablesGenerator(config, { schemas, tables })
  console.log("Done ✨")

  process.stdout.write(" 🡺 Generating views... ")
  await viewsGenerator(config, { schemas, views })
  console.log("Done ✨")

  const context = {
    BANNER,
    tables,
    views,
  }

  await renderToFile(
    resolvePath(config.base, "base.ts"),
    baseTpl,
    context,
    { format: true },
  )

})

