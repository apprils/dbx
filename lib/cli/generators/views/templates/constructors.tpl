
{{#views.length}}
{{! importing only if there are views }}
import type { Config } from "@appril/dbx";
import * as dbx from "@appril/dbx";
import { connection } from "{{importBase}}/{{base}}/setup";
type PartialConfig = Partial<Omit<Config, "connection" | "tableName">>
{{/views.length}}

{{#views}}

/** {{name}} constructor */
export function {{constructorName}}<Ext = unknown>(
  ext?: Ext,
  cfg?: PartialConfig,
) {
  return dbx.default<"{{declaredName}}", Ext>(
    {
      primaryKey: "{{primaryKey}}",
      ...cfg,
      connection,
      tableName: "{{schema}}.{{name}}",
    },
    ext
  )
}
{{/views}}

{{^views.length}}
export {}
{{/views.length}}

