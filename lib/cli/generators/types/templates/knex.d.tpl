{{BANNER}}

/// <reference path="./module.d.ts" />

declare module "knex/types/tables" {
  interface Tables {
  {{#tables}}
    "{{base}}:{{name}}": import("knex").Knex.CompositeTableType<
      import("{{base}}:{{name}}").RecordT,
      import("{{base}}:{{name}}").InsertT,
      import("{{base}}:{{name}}").UpdateT,
      import("{{base}}:{{name}}").QueryT
    >;
  {{/tables}}
  {{#views}}
    "{{base}}:{{name}}": import("knex").Knex.CompositeTableType<
      import("{{base}}:{{name}}").RecordT
    >;
  {{/views}}
  }
}

{{! needed for declared modules to be treated as augmented rather than ambient }}
export {}

