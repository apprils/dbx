import { readFile } from "fs/promises"
import fsx from "fs-extra"

import type {
  GeneratorConfig,
  ViewDeclaration,
  ViewsTemplates,
} from "../../@types"

import { resolvePath } from "../../base"
import { BANNER, renderToFile } from "../../render"

import entryTpl from "./templates/entry.tpl"
import indexTpl from "./templates/index.tpl"

type RenderContext = {
  BANNER: string
  base: string
  importBase: string
  views: ViewDeclaration[]
}

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName, string>

const defaultTemplates: Required<ViewsTemplates> = {
  entry: entryTpl,
  index: indexTpl,
}

export default async function viewsGenerator(
  config: GeneratorConfig,
  {
    views,
  }: {
    schemas: string[]
    views: ViewDeclaration[]
  },
): Promise<void> {
  const { base, importBase, viewsDir, viewsTemplates } = config

  const templates: TemplateMap = { ...defaultTemplates }

  for (const [name, file] of Object.entries({ ...viewsTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  for (const view of views) {
    const { schema, name } = view
    const file = resolvePath(base, viewsDir, schema, name + ".ts")

    if (await fsx.pathExists(file)) {
      continue
    }

    await renderToFile(file, templates.entry, view)
  }

  const context = {
    BANNER,
    base,
    importBase,
    views,
  }

  await renderToFile<RenderContext>(
    resolvePath(base, viewsDir, "index.ts"),
    templates.index,
    context,
    { format: true },
  )
}
