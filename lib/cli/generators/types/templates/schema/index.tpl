
/// <reference path="./module.d.ts" />
{{BANNER}}

import "./knex";

export * from "./enums";

{{#tables}}
export type {
  RecordT as {{recordName}},
  InsertT as {{insertName}},
  UpdateT as {{updateName}},
  QueryT as {{queryBuilder}},
} from "dbx:{{schema}}/{{name}}";

{{/tables}}

{{#views}}
export type {
  RecordT as {{recordName}},
  QueryT as {{queryBuilder}},
} from "dbx:{{schema}}/{{name}}";

{{/views}}

{{^tables.length}}
export {}
{{/tables.length}}

