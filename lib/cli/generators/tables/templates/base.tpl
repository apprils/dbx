{{BANNER}}

{{#tables.length}}
{{! importing only if there are tables }}
import * as dbx from "@appril/dbx";
import { connection } from "{{importBase}}/{{base}}/setup";
{{/tables.length}}

{{#tables}}
export function {{constructorName}}<
  TExtra = import("@dbx:{{declaredName}}/tExtra").TExtra
>(
  extra: TExtra,
) {
  {{#primaryKey}}
  return dbx.default<
    "{{declaredName}}",
    TExtra
  >({
    connection,
    tableName: "{{schema}}.{{name}}",
    primaryKey: "{{primaryKey}}",
  }, extra)
  {{/primaryKey}}
  {{^primaryKey}}
  return dbx.withoutPrimaryKey<
    "{{declaredName}}",
    TExtra
  >({
    connection,
    tableName: "{{schema}}.{{name}}",
  }, extra)
  {{/primaryKey}}
}

{{constructorName}}.tableName = "{{name}}"

{{/tables}}

