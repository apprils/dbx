import { readFile } from "fs/promises"
import fsx from "fs-extra"

import type {
  GeneratorConfig,
  TableDeclaration,
  TablesTemplates,
} from "../../@types"

import { resolvePath } from "../../base"
import { BANNER, renderToFile } from "../../render"

import entryTpl from "./templates/entry.tpl"
import indexTpl from "./templates/index.tpl"

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName, string>

type RenderContext = {
  BANNER: string
  base: string
  importBase: string
  tables: TableDeclaration[]
}

const defaultTemplates: Required<TablesTemplates> = {
  entry: entryTpl,
  index: indexTpl,
}

export default async function tablesGenerator(
  config: GeneratorConfig,
  {
    tables,
  }: {
    schemas: string[]
    tables: TableDeclaration[]
  },
): Promise<void> {
  const { base, importBase, tablesDir, tablesTemplates } = config

  const templates: TemplateMap = { ...defaultTemplates }

  for (const [name, file] of Object.entries({ ...tablesTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  for (const table of tables) {
    const { schema, name } = table
    const file = resolvePath(base, tablesDir, schema, name + ".ts")

    if (await fsx.pathExists(file)) {
      continue
    }

    await renderToFile(file, templates.entry, table)
  }

  const context = {
    BANNER,
    base,
    importBase,
    tables,
  }

  await renderToFile<RenderContext>(
    resolvePath(base, tablesDir, "index.ts"),
    templates.index,
    context,
    { format: true },
  )
}
