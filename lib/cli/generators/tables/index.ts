
import { readFile } from "fs/promises";
import fsx from "fs-extra";

import type {
  GeneratorConfig,
  TableDeclaration, TablesRenderContext, TablesTemplates,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, renderToFile } from "../../render";

import baseTpl from "./templates/base.tpl";
import entryTpl from "./templates/entry.tpl";
import indexTpl from "./templates/index.tpl";

const defaultTemplates: Required<TablesTemplates> = {
  base: baseTpl,
  entry: entryTpl,
  index: indexTpl,
}

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName, string>

export default async function tablesGenerator(config: GeneratorConfig, {
  tables,
}: {
  schemas: string[];
  tables: TableDeclaration[];
}): Promise<void> {

  const {
    base,
    importBase,
    typesDir,
    tablesDir,
    tablesTemplates,
  } = config

  const pathResolver = (...args: string[]) => resolvePath(base, tablesDir, ...args)

  const templates: TemplateMap = { ...defaultTemplates }

  for (const [ name, file ] of Object.entries({ ...tablesTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  for (const table of tables) {

    const { schema, name } = table
    const file = pathResolver(schema, name + ".ts")

    if (await fsx.pathExists(file)) {
      continue
    }

    await renderToFile(
      file,
      templates.entry,
      table,
    )

  }

  const context = {
    BANNER,
    base,
    importBase,
    typesDir,
    tables,
  }

  await renderToFile<TablesRenderContext>(
    pathResolver("base.ts"),
    templates.base,
    context,
  )

  await renderToFile<TablesRenderContext>(
    pathResolver("index.ts"),
    templates.index,
    context,
  )

}

