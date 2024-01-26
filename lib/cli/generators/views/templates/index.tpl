{{BANNER}}

{{#views.length}}
{{! importing only if there are views }}
import * as dbx from "@appril/dbx";
import { connection } from "{{importBase}}/{{base}}/setup";
{{/views.length}}

{{#views}}
export function {{name}}<
  TExtra = import("{{base}}:{{name}}/tExtra").TExtra
>(
  extra: TExtra,
) {
  return dbx.default<
    "{{base}}:{{name}}",
    TExtra
  >({
    connection,
    tableName: "{{schema}}.{{name}}",
    primaryKey: "{{primaryKey}}",
  }, extra)
};

{{name}}.tableName = "{{name}}";

{{/views}}

