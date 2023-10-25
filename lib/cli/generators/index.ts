
import nopt from "nopt";
import fsx from "fs-extra";
import pgts from "@appril/pgts";

import { resolvePath, run } from "../base";

import typesGenerator from "./types";
import tablesGenerator from "./tables";
import viewsGenerator from "./views";

import type { GeneratorConfig } from "../@types";

const {
  config: configFile,
  generate,
} = nopt({
  config: String,
  generate: String,
}, {
  c: [ "--config" ],
  g: [ "--generate" ],
})

run(async () => {

  if (!await fsx.pathExists(configFile)) {
    throw new Error(`Config file does not exists: ${ configFile }`)
  }

  if (![ "types", "tables", "views", "*" ].includes(generate)) {
    throw new Error(`Unknown generator: ${ generate }`)
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

  if ([ "types", "*" ].includes(generate)) {

    process.stdout.write(" 🡺 Generating types... ")
    await typesGenerator(config, { schemas, tables, views, enums })
    console.log("Done ✨")

  }

  if ([ "tables", "*" ].includes(generate)) {

    process.stdout.write(" 🡺 Generating tables... ")
    await tablesGenerator(config, { schemas, tables })
    console.log("Done ✨")

  }

  if ([ "views", "*" ].includes(generate)) {

    process.stdout.write(" 🡺 Generating views... ")
    await viewsGenerator(config, { schemas, views })
    console.log("Done ✨")

  }

})

