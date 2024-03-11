import { resolve, join } from "node:path";

import fsx from "fs-extra";

import { renderToFile } from "./render";

const CWD = process.cwd();

export const GENERATED_FILES_DIR = "generated-files-handler";

export function resolvePath(...path: string[]): string {
  return resolve(CWD, join(...path));
}

export function run(task: () => Promise<void>) {
  task()
    .then(() => process.exit(0))
    // biome-ignore lint:
    .catch((error: any) => {
      console.error(`\n  \x1b[31m×\x1b[0m ${error.message}\n`);
      console.error(error);
      process.exit(1);
    });
}

export function filesGeneratorFactory() {
  const generatedFiles = new Set<string>();
  return {
    generateFile<RenderContext = object>(
      outfile: string,
      render: { template: string; context: RenderContext },
    ) {
      generatedFiles.add(outfile);
      return renderToFile(
        resolvePath(outfile),
        render.template,
        render.context,
      );
    },
    persistGeneratedFiles(outfile: string, lineMapper?: (f: string) => string) {
      return persistGeneratedFiles(
        outfile,
        lineMapper ? [...generatedFiles].map(lineMapper) : [...generatedFiles],
      );
    },
  };
}

export function persistGeneratedFiles(outfile: string, entries: string[]) {
  return fsx.outputFile(
    resolvePath("var/.cache", GENERATED_FILES_DIR, outfile),
    [...entries].join("\n"),
  );
}
