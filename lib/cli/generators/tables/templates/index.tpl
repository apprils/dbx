{{BANNER}}

{{#tables.length}}
{{! importing only if there are tables }}
import * as dbx from "@appril/dbx";
import { connection } from "{{importBase}}/{{base}}/setup";
{{/tables.length}}

{{#tables}}
export function {{name}}<
  TExtra = import("{{base}}:{{name}}/tExtra").TExtra
>(
  extra: TExtra,
) {
  {{#primaryKey}}
  return dbx.default<
    "{{base}}:{{name}}",
    TExtra
  >({
    connection,
    tableName: "{{schema}}.{{name}}",
    primaryKey: "{{primaryKey}}",
  }, extra)
  {{/primaryKey}}
  {{^primaryKey}}
  return dbx.withoutPrimaryKey<
    "{{base}}:{{name}}",
    TExtra
  >({
    connection,
    tableName: "{{schema}}.{{name}}",
  }, extra)
  {{/primaryKey}}
};

{{name}}.tableName = "{{name}}";

{{/tables}}

