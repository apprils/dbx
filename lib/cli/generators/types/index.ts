
import { readFile } from "fs/promises";
import fsx from "fs-extra";

import type {
  GeneratorConfig, TypesRenderContext, TypesTemplates,
  TableDeclaration, ViewDeclaration, EnumDeclaration,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, ONETIME_BANNER, renderToFile } from "../../render";

import tableTpl from "./templates/table.tpl";
import viewTpl from "./templates/view.tpl";
import enumsTpl from "./templates/enums.tpl";
import typesTpl from "./templates/types.tpl";
import indexTpl from "./templates/index.tpl";

const defaultTemplates: Required<TypesTemplates> = {
  table: BANNER + tableTpl,
  view:  BANNER + viewTpl,
  enums: BANNER + enumsTpl,
  types: BANNER + typesTpl,
}

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName | string, string>

export default async function typesGenerator(config: GeneratorConfig, {
  schemas,
  tables,
  views,
  enums,
}: {
  schemas: string[];
  tables: TableDeclaration[];
  views: ViewDeclaration[];
  enums: EnumDeclaration[];
}): Promise<void> {

  const {
    base,
    typesDir,
    typesTemplates,
  } = config

  const pathResolver = (...args: string[]) => resolvePath(base, typesDir, ...args)

  const templates: TemplateMap = { ...defaultTemplates }

  for (const [ name, file ] of Object.entries({ ...typesTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  for (const schema of schemas) {
    await fsx.emptyDir(pathResolver(schema))
  }

  for (const table of tables) {
    await renderToFile<TableDeclaration>(
      pathResolver(table.schema, table.declaredName + ".ts"),
      templates.table,
      table,
    )
  }

  for (const view of views) {
    await renderToFile<ViewDeclaration>(
      pathResolver(view.schema, view.declaredName + ".ts"),
      templates.view,
      view,
    )
  }

  for (const schema of schemas) {

    const context = {
      schema,
      enums: enums.filter((e) => e.schema === schema),
      tables: tables.filter((e) => e.schema === schema),
      views: views.filter((e) => e.schema === schema),
    }

    await renderToFile<TypesRenderContext>(
      pathResolver(schema, "@enums.ts"),
      templates.enums,
      context,
    )

    await renderToFile<TypesRenderContext>(
      pathResolver(schema, "@types.ts"),
      templates.types,
      context,
    )

  }

  const indexFile = pathResolver("index.ts")

  if (!await fsx.pathExists(indexFile)) {
    await renderToFile(indexFile, ONETIME_BANNER + indexTpl, { schemas })
  }

}

