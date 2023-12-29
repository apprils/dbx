{{BANNER}}

import type { Knex } from "knex";

declare module "knex/types/tables" {
  interface Tables {
  {{#tables}}
    "{{declaredName}}": Knex.CompositeTableType<
      import("@appril/dbx:{{declaredName}}").RecordT,
      import("@appril/dbx:{{declaredName}}").InsertT,
      import("@appril/dbx:{{declaredName}}").UpdateT,
      import("@appril/dbx:{{declaredName}}").QueryT
    >;
  {{/tables}}
  {{#views}}
    "{{declaredName}}": Knex.CompositeTableType<
      import("@appril/dbx:{{declaredName}}").RecordT
    >;
  {{/views}}
  }
}

