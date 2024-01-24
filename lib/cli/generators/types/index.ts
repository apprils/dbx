
import { readFile } from "fs/promises";

import type {
  GeneratorConfig, TypesRenderContext, TypesTemplates,
  TableDeclaration, ViewDeclaration, EnumDeclaration,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, render, renderToFile } from "../../render";

import knexDtsTpl from "./templates/knex.d.tpl";
import moduleDtsTpl from "./templates/module.d.tpl";
import tBaseTpl from "./templates/tBase.tpl";
import tExtraTpl from "./templates/tExtra.tpl";
import tIndexTpl from "./templates/tIndex.tpl";

const defaultTemplates: Required<TypesTemplates> = {
  knexDts: knexDtsTpl,
  moduleDts: moduleDtsTpl,
  tBase: tBaseTpl,
  tExtra: tExtraTpl,
  tIndex: tIndexTpl,
}

type TemplateName = keyof typeof defaultTemplates

export default async function typesGenerator(config: GeneratorConfig, {
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

  const templates: typeof defaultTemplates = { ...defaultTemplates }

  for (const [ name, file ] of Object.entries({ ...typesTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  function renderModules<T extends TableDeclaration | ViewDeclaration>(
    entry: T,
  ) {

    const isTable = "regularColumns" in entry

    const renderModule = (
      tpl: string,
      ctx?: Record<string, any>,
    ) => render(tpl, {
      ...entry,
      ...ctx,
      isTable,
    })

    return {
      ...entry,
      tBaseModule: renderModule(templates.tBase),
      tExtraModule: renderModule(templates.tExtra),
      tIndexModule: renderModule(templates.tIndex),
    }

  }

  const context: TypesRenderContext = {
    BANNER,
    enums,
    tables: tables.map(renderModules<TableDeclaration>),
    views: views.map(renderModules<ViewDeclaration>),
  }

  for (
    const [ outFile, tplName ] of [
      [ "knex.d.ts", "knexDts" ],
      [ "module.d.ts", "moduleDts" ],
    ] satisfies [ outFile: string, tplName: TemplateName ][]
  ) {

    await renderToFile<TypesRenderContext>(
      pathResolver(outFile),
      templates[tplName],
      context,
    )

  }

}

