import { join } from "path";

import fsx from "fs-extra";

import type {
  GeneratorConfig,
  ViewDeclaration,
  ViewsTemplates,
} from "../../@types";

import { resolvePath, filesGeneratorFactory } from "../../base";
import { BANNER, renderToFile } from "../../render";

import entryTpl from "./templates/entry.tpl";
import indexTpl from "./templates/index.tpl";

type RenderContext = {
  BANNER: string;
  base: string;
  importBase: string;
  views: ViewDeclaration[];
};

type TemplateName = keyof typeof defaultTemplates;
type TemplateMap = Record<TemplateName, string>;

const defaultTemplates: Required<ViewsTemplates> = {
  entry: entryTpl,
  index: indexTpl,
};

export default async function viewsGenerator(
  config: GeneratorConfig,
  {
    views,
  }: {
    schemas: string[];
    views: ViewDeclaration[];
  },
): Promise<void> {
  const { base, importBase, viewsDir, viewsTemplates } = config;

  const templates: TemplateMap = { ...defaultTemplates };

  for (const [name, file] of Object.entries({ ...viewsTemplates })) {
    templates[name as TemplateName] = await fsx.readFile(
      resolvePath(file),
      "utf8",
    );
  }

  for (const view of views) {
    const { schema, name } = view;
    const file = resolvePath(base, viewsDir, schema, name + ".ts");
    await renderToFile(file, templates.entry, view, { overwrite: false });
  }

  const filesGenerator = filesGeneratorFactory();

  await filesGenerator.generateFile<RenderContext>(
    join(base, viewsDir, "index.ts"),
    {
      template: templates.index,
      context: {
        BANNER,
        base,
        importBase,
        views,
      },
    },
  );

  await filesGenerator.persistGeneratedFiles(join(base, viewsDir));
}
