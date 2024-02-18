import { join } from "path";

import nopt from "nopt";
import fsx from "fs-extra";
import pgts from "@appril/pgts";

import { resolvePath, run, filesGeneratorFactory } from "../base";

import typesGenerator from "./types";

import type { GeneratorConfig, Templates } from "../@types";
import { BANNER, renderToFile } from "../render";

import baseTpl from "./templates/base.tpl";
import indexTpl from "./templates/index.tpl";
import tableTpl from "./templates/table.tpl";

const defaultTemplates: Required<Templates> = {
  base: baseTpl,
  index: indexTpl,
  table: tableTpl,
};

type TemplateName = keyof typeof defaultTemplates;

const { config: configFile } = nopt(
  {
    config: String,
  },
  {
    c: ["--config"],
  },
);

run(async () => {
  if (!(await fsx.pathExists(configFile))) {
    throw new Error(`Config file does not exists: ${configFile}`);
  }

  const config: GeneratorConfig = require(resolvePath(configFile)).default;
  const { base } = config;

  for (const requiredParam of ["connection", "base"] as const) {
    if (!config[requiredParam]) {
      throw new Error(
        `Incomplete config provided, ${requiredParam} param missing`,
      );
    }
  }

  const { schemas, tables, views, enums, typeImports } = await pgts(
    config.connection,
    config,
  );

  const templates: typeof defaultTemplates = { ...defaultTemplates };

  for (const [name, file] of Object.entries({ ...config.templates })) {
    templates[name as TemplateName] = await fsx.readFile(
      resolvePath(file),
      "utf8",
    );
  }

  process.stdout.write(" 🡺 Generating types... ");
  await typesGenerator(config, { schemas, tables, views, enums, typeImports });
  console.log("Done ✨");

  process.stdout.write(" 🡺 Generating tables... ");

  for (const table of [...tables, ...views]) {
    const { schema, name } = table;
    const file = resolvePath(config.base, schema, "tables", `${name}.ts`);
    await renderToFile(file, templates.table, table, { overwrite: false });
  }

  const filesGenerator = filesGeneratorFactory();

  for (const schema of schemas) {
    const schemaTables = tables.filter((e) => e.schema === schema);
    const schemaViews = views.filter((e) => e.schema === schema);

    const context = {
      BANNER,
      base,
      tables: schemaTables,
      views: schemaViews,
    };

    await filesGenerator.generateFile(join(base, schema, "index.ts"), {
      template: templates.index,
      context,
    });

    await filesGenerator.generateFile(join(base, schema, "base.ts"), {
      template: templates.base,
      context,
    });
  }

  await filesGenerator.persistGeneratedFiles(join(base, "tables"));

  console.log("Done ✨");
});
