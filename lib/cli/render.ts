
import fsx from "fs-extra";
import mustache from "mustache";

const generator = require("../../package.json");

// disabling escape
mustache.escape = s => s

export function render<Context = {}>(template: string, context: Context): string {
  return mustache.render(template, { ...context, generator })
}

export function renderToFile<Context = {}>(
  file: string,
  template: string,
  context: Context,
): Promise<void> {
  return fsx.outputFile(
    file,
    render(template, context),
    "utf8"
  )
}

export const BANNER = `/**
* @generated file, do not modify manually!
*/`

export const ONETIME_BANNER = `/**
* @created automatically at initialization, feel free to modify as needed
*/`

