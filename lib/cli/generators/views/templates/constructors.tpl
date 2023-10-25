
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
  {{#primaryKey}}
  return dbx.default<"{{schema}}.{{name}}", Ext>(
    {
      primaryKey: "{{primaryKey}}",
      ...cfg,
      connection,
      tableName: "{{schema}}.{{name}}",
    },
    ext
  )
  {{/primaryKey}}
  {{^primaryKey}}
  return dbx.withoutPrimaryKey<"{{schema}}.{{name}}", Ext>(
    {
      ...cfg,
      connection,
      tableName: "{{schema}}.{{name}}",
    },
    ext
  )
  {{/primaryKey}}
}
{{/views}}

{{^views.length}}
export {}
{{/views.length}}

