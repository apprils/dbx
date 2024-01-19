{{BANNER}}

declare module "knex/types/tables" {
  interface Tables {
  {{#tables}}
    "{{declaredName}}": import("knex").Knex.CompositeTableType<
      import("@dbx:{{declaredName}}").RecordT,
      import("@dbx:{{declaredName}}").InsertT,
      import("@dbx:{{declaredName}}").UpdateT,
      import("@dbx:{{declaredName}}").QueryT
    >;
  {{/tables}}
  {{#views}}
    "{{declaredName}}": Knex.CompositeTableType<
      import("@dbx:{{declaredName}}").RecordT
    >;
  {{/views}}
  }
}

// needed for declared modules to be treated as augmented rather than ambient
export {}

