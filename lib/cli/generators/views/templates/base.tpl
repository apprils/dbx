{{BANNER}}

{{#views.length}}
{{! importing only if there are views }}
import * as dbx from "@appril/dbx";
import { connection } from "{{importBase}}/{{base}}/setup";
{{/views.length}}

{{#views}}
export function {{constructorName}}<
  TExtra = import("@dbx:{{declaredName}}/tExtra").TExtra
>(
  extra: TExtra,
) {
  return dbx.default<
    "{{declaredName}}",
    TExtra
  >({
    connection,
    tableName: "{{schema}}.{{name}}",
    primaryKey: "{{primaryKey}}",
  }, extra)
}

{{constructorName}}.tableName = "{{name}}"

{{/views}}

