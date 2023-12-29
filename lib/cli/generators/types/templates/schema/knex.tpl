{{BANNER}}

import type { Knex } from "knex";

declare module "knex/types/tables" {
  interface Tables {
  {{#tables}}
    "{{schema}}.{{name}}": Knex.CompositeTableType<
      import("dbx:{{schema}}/{{name}}").RecordT,
      import("dbx:{{schema}}/{{name}}").InsertT,
      import("dbx:{{schema}}/{{name}}").UpdateT,
      import("dbx:{{schema}}/{{name}}").QueryT
    >;
  {{/tables}}
  {{#views}}
    "{{schema}}.{{name}}": Knex.CompositeTableType<
      import("dbx:{{schema}}/{{name}}").RecordT
    >;
  {{/views}}
  }
}

