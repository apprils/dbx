
import nopt from "nopt";
import { sortBy } from "lodash";
import { glob } from "glob";

import { resolvePath } from "../base";
import { BANNER, renderToFile } from "../render";

import defaultTemplate from "./templates/knexfile.tpl";

import type { MigrationsConfig } from "../@types";

type MigrationsSourceFile = {
  path: string;
  const: string;
}

type MigrationsSourceRenderContext = MigrationsConfig & {
  dbxfile: string;
  files: MigrationsSourceFile[];
}

const {
  dbxfile,
  outfile,
} = nopt({
  dbxfile: String,
  outfile: String,
})

export default async function generateKnexfile(
  config: MigrationsConfig,
): Promise<void> {

  if (!dbxfile) {
    throw new Error("No dbxfile provided")
  }

  if (!outfile) {
    throw new Error("No outfile provided")
  }

  const {
    base,
    migrationDir,
    migrationTemplates,
  } = config

  const matches: string[] = await glob("**/*.ts", {
    cwd: resolvePath(base, migrationDir),
    posix: true,
    nodir: true,
    nocase: false,
  })

  const files: MigrationsSourceFile[] = []

  for (const path of matches) {
    files.push({
      path: path.replace(/\.ts$/, ""),
      const: "$" + path.replace(/\W/g, "_"),
    })
  }

  const template = migrationTemplates?.knexfile || defaultTemplate

  await renderToFile<MigrationsSourceRenderContext>(
    resolvePath(outfile),
    BANNER + template,
    {
      ...config,
      dbxfile: dbxfile.replace(/\.ts$/, ""),
      files: sortBy(files, "path"),
    }
  )

}

