
import { readFile } from "fs/promises";
import fsx from "fs-extra";

import type {
  GeneratorConfig,
  ViewDeclaration, ViewsRenderContext, ViewsTemplates,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, renderToFile } from "../../render";

import baseTpl from "./templates/base.tpl";
import entryTpl from "./templates/entry.tpl";
import indexTpl from "./templates/index.tpl";

const defaultTemplates: Required<ViewsTemplates> = {
  base: baseTpl,
  entry: entryTpl,
  index: indexTpl,
}

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName, string>

export default async function viewsGenerator(config: GeneratorConfig, {
  views,
}: {
  schemas: string[];
  views: ViewDeclaration[];
}): Promise<void> {

  const {
    base,
    importBase,
    typesDir,
    viewsDir,
    viewsTemplates,
  } = config

  const pathResolver = (...args: string[]) => resolvePath(base, viewsDir, ...args)

  const templates: TemplateMap = { ...defaultTemplates }

  for (const [ name, file ] of Object.entries({ ...viewsTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  for (const view of views) {

    const { schema, name } = view
    const file = pathResolver(schema, name + ".ts")

    if (await fsx.pathExists(file)) {
      continue
    }

    await renderToFile(
      file,
      templates.entry,
      view,
    )

  }

  const context = {
    BANNER,
    base,
    importBase,
    typesDir,
    views,
  }

  await renderToFile<ViewsRenderContext>(
    pathResolver("base.ts"),
    templates.base,
    context,
  )

  await renderToFile<ViewsRenderContext>(
    pathResolver("index.ts"),
    templates.index,
    context,
  )

}

