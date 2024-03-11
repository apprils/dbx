import { join } from "node:path";

import fsx from "fs-extra";

import type {
  GeneratorConfig,
  TypesTemplates,
  TableDeclaration,
  ViewDeclaration,
  EnumDeclaration,
  TypeImport,
} from "../../@types";

import { resolvePath, filesGeneratorFactory } from "../../base";
import { BANNER } from "../../render";

import knexDtsTpl from "./templates/knex.d.tpl";
import moduleDtsTpl from "./templates/module.d.tpl";
import indexTpl from "./templates/index.tpl";

const defaultTemplates: Required<TypesTemplates> = {
  knexDts: knexDtsTpl,
  moduleDts: moduleDtsTpl,
  index: indexTpl,
};

type TemplateName = keyof typeof defaultTemplates;

export default async function typesGenerator(
  config: GeneratorConfig,
  {
    schemas,
    tables,
    views,
    enums,
    typeImports,
  }: {
    schemas: string[];
    tables: TableDeclaration[];
    views: ViewDeclaration[];
    enums: EnumDeclaration[];
    typeImports: TypeImport[];
  },
): Promise<void> {
  const { base, typesTemplates } = config;

  const templates: typeof defaultTemplates = { ...defaultTemplates };

  for (const [name, file] of Object.entries({ ...typesTemplates })) {
    templates[name as TemplateName] = await fsx.readFile(
      resolvePath(file),
      "utf8",
    );
  }

  const filesGenerator = filesGeneratorFactory();

  for (const schema of schemas) {
    const schemaTables = tables.filter((e) => e.schema === schema);
    const schemaViews = views.filter((e) => e.schema === schema);
    const schemaTypeImports = typeImports.filter((e) =>
      e.schemas.includes(schema),
    );

    const context = {
      BANNER,
      base,
      enums,
      tables: schemaTables,
      views: schemaViews,
      typeImports,
    };

    for (const [outFile, tplName] of [
      ["knex.d.ts", "knexDts"],
      ["module.d.ts", "moduleDts"],
      ["index.ts", "index"],
    ] satisfies [outFile: string, tplName: TemplateName][]) {
      await filesGenerator.generateFile(join(base, schema, "types", outFile), {
        template: templates[tplName],
        context,
      });
    }
  }

  await filesGenerator.persistGeneratedFiles(join(base, "types"));
}
