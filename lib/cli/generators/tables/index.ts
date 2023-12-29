
import { readFile } from "fs/promises";
import fsx from "fs-extra";

import type {
  GeneratorConfig,
  TableDeclaration, TablesRenderContext, TablesTemplates,
} from "../../@types";

import { resolvePath } from "../../base";
import { BANNER, ONETIME_BANNER, renderToFile } from "../../render";

import tableTpl from "./templates/table.tpl";
import constantsTpl from "./templates/constants.tpl";
import constructorsTpl from "./templates/constructors.tpl";
import schemaIndexTpl from "./templates/schemaIndex.tpl";
import indexTpl from "./templates/index.tpl";

const defaultTemplates: Required<TablesTemplates> = {
  table: tableTpl,
  constants: BANNER + constantsTpl,
  constructors: BANNER + constructorsTpl,
  schemaIndex: BANNER + schemaIndexTpl,
}

type TemplateName = keyof typeof defaultTemplates
type TemplateMap = Record<TemplateName | string, string>

export default async function tablesGenerator(config: GeneratorConfig, {
  schemas,
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
      templates.table,
      table,
    )

  }

  for (const schema of schemas) {

    const context = {
      schema,
      base,
      importBase,
      typesDir,
      tables: tables.filter((e) => e.schema === schema),
    }

    await renderToFile<TablesRenderContext>(
      pathResolver(schema, "@constants.ts"),
      templates.constants,
      context,
    )

    await renderToFile<TablesRenderContext>(
      pathResolver(schema, "@constructors.ts"),
      templates.constructors,
      context,
    )

    await renderToFile<TablesRenderContext>(
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

