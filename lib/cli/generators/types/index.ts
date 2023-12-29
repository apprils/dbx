
import { readFile } from "fs/promises";
import fsx from "fs-extra";

import type {
  GeneratorConfig, TypesRenderContext, TypesTemplates,
  TableDeclaration, ViewDeclaration, EnumDeclaration,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, ONETIME_BANNER, renderToFile } from "../../render";

import enumsTpl from "./templates/schema/enums.tpl";
import indexTpl from "./templates/schema/index.tpl";
import knexTpl from "./templates/schema/knex.tpl";
import moduleDtsTpl from "./templates/schema/module.d.tpl";
import indexInitTpl from "./templates/index.tpl";

const defaultTemplates: Required<TypesTemplates> = {
  enums: enumsTpl,
  index: indexTpl,
  knex: knexTpl,
  moduleDts: moduleDtsTpl,
}

type TemplateName = keyof typeof defaultTemplates

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

  const templates: typeof defaultTemplates = { ...defaultTemplates }

  for (const [ name, file ] of Object.entries({ ...typesTemplates })) {
    templates[name as TemplateName] = await readFile(resolvePath(file), "utf8")
  }

  for (const schema of schemas) {
    await fsx.emptyDir(pathResolver(schema))
  }

  for (const schema of schemas) {

    const context = {
      BANNER,
      schema,
      enums: enums.filter((e) => e.schema === schema),
      tables: tables.filter((e) => e.schema === schema),
      views: views.filter((e) => e.schema === schema),
    }

    for (
      const [ outFile, tplName ] of [
        [ "enums.ts", "enums" ],
        [ "index.ts", "index" ],
        [ "knex.ts", "knex" ],
        [ "module.d.ts", "moduleDts" ],
      ] satisfies [ outFile: string, tplName: TemplateName ][]
    ) {

      await renderToFile<TypesRenderContext>(
        pathResolver(schema, outFile),
        templates[tplName],
        context,
      )

    }

  }

  const indexFile = pathResolver("index.ts")

  if (!await fsx.pathExists(indexFile)) {
    await renderToFile(indexFile, ONETIME_BANNER + indexInitTpl, { schemas })
  }

}

