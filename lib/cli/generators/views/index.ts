
import { readFile } from "fs/promises";
import fsx from "fs-extra";

import type {
  GeneratorConfig,
  ViewDeclaration, ViewsRenderContext, ViewsTemplates,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, ONETIME_BANNER, renderToFile } from "../../render";

import viewTpl from "./templates/view.tpl";
import constantsTpl from "./templates/constants.tpl";
import constructorsTpl from "./templates/constructors.tpl";
import schemaIndexTpl from "./templates/schemaIndex.tpl";
import indexTpl from "./templates/index.tpl";

const defaultTemplates: Required<ViewsTemplates> = {
  view: viewTpl,
  constants: BANNER + constantsTpl,
  constructors: BANNER + constructorsTpl,
  schemaIndex: BANNER + schemaIndexTpl,
}

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName | string, string>

export default async function viewsGenerator(config: GeneratorConfig, {
  schemas,
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

    const { schema, declaredName } = view
    const file = pathResolver(schema, declaredName + ".ts")

    if (await fsx.pathExists(file)) {
      continue
    }

    await renderToFile(
      file,
      templates.view,
      view
    )

  }

  for (const schema of schemas) {

    const context = {
      schema,
      base,
      importBase,
      typesDir,
      views: views.filter((e) => e.schema === schema),
    }

    await renderToFile<ViewsRenderContext>(
      pathResolver(schema, "@constants.ts"),
      templates.constants,
      context,
    )

    await renderToFile<ViewsRenderContext>(
      pathResolver(schema, "@constructors.ts"),
      templates.constructors,
      context,
    )

    await renderToFile<ViewsRenderContext>(
      pathResolver(schema, "@index.ts"),
      templates.schemaIndex,
      context,
    )

  }

  const indexFile = pathResolver("index.ts")

  if (!await fsx.pathExists(indexFile)) {
    await renderToFile(indexFile, ONETIME_BANNER + indexTpl, { schemas })
  }

}

