{{BANNER}}

import * as dbx from "@appril/dbx";
import { connection } from "../setup";

{{#tables}}
export function {{name}}<
  TExtra = import("{{base}}:{{name}}").TExtra
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

{{#views}}
export function {{name}}<
  TExtra = import("{{base}}:{{name}}").TExtra
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

