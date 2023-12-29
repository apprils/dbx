
{{#tables.length}}
{{! importing only if there are tables }}
import type { Config } from "@appril/dbx";
import * as dbx from "@appril/dbx";
import { connection } from "{{importBase}}/{{base}}/setup";
type PartialConfig = Partial<Omit<Config, "connection" | "tableName">>
{{/tables.length}}

{{#tables}}

/** {{name}} constructor */
export function {{constructorName}}<Ext = unknown>(
  ext?: Ext,
  cfg?: PartialConfig,
) {
  {{#primaryKey}}
  return dbx.default<"{{declaredName}}", Ext>(
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
  return dbx.withoutPrimaryKey<"{{declaredName}}", Ext>(
    {
      ...cfg,
      connection,
      tableName: "{{schema}}.{{name}}",
    },
    ext
  )
  {{/primaryKey}}
}
{{/tables}}

{{^tables.length}}
export {}
{{/tables.length}}

