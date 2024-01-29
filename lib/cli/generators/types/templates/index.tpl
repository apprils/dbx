{{BANNER}}

export * from "./enums";

{{#tables}}
export type {
  RecordT as {{recordName}},
  InsertT as {{insertName}},
  UpdateT as {{updateName}},
  QueryT  as {{queryBuilder}},
} from "{{base}}:{{name}}";

{{/tables}}

{{#views}}
export type {
  RecordT as {{recordName}},
  QueryT  as {{queryBuilder}},
} from "{{base}}:{{name}}";

{{/views}}

