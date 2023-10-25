
import type { Knex } from "knex";
import type { QueryBuilder } from "@appril/dbx";

/** {{name}} types */
{{#typeImports}}
import type { {{import}} as {{as}} } from "{{from}}";
{{/typeImports}}

{{#enumImports}}
import type { {{.}} } from "./@enums";
{{/enumImports}}

export type {{recordName}} = {
{{#columns}}

{{#comments}}  /** {{.}} */
{{/comments}}
  {{name}}: {{declaredType}};
{{/columns}}
}

export type {{queryBuilder}} = QueryBuilder<"{{schema}}.{{name}}">;

declare module "knex/types/tables" {
  interface Tables {
    "{{schema}}.{{name}}": Knex.CompositeTableType<{{recordName}}>;
  }
}

