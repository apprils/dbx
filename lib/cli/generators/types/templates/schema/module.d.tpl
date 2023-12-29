{{BANNER}}

{{#tables}}
declare module "@appril/dbx:{{declaredName}}" {

  import type { QueryBuilder } from "@appril/dbx";

  {{#typeImports}}
  type {{as}} = import("{{from}}").{{import}};
  {{/typeImports}}

  {{#enumImports}}
  type {{.}} = import("./enums").{{.}};
  {{/enumImports}}

  export type RecordT = {
  {{#columns}}

  {{#comments}}  /** {{.}} */
  {{/comments}}
    {{name}}: {{declaredType}};
  {{/columns}}
  }

  export type InsertT = {
  {{#columns}}

  {{#comments}}  /** {{.}} */
  {{/comments}}
  {{^isGenerated}}  {{name}}{{#isOptional}}?{{/isOptional}}: {{declaredType}};
  {{/isGenerated}}
  {{/columns}}
  }

  export type UpdateT = {
  {{#columns}}

  {{#comments}}  /** {{.}} */
  {{/comments}}
  {{^isGenerated}}  {{name}}?: {{declaredType}};
  {{/isGenerated}}
  {{/columns}}
  }

  export type QueryT = QueryBuilder<"{{declaredName}}">;

}

{{/tables}}

{{#views}}
declare module "@appril/dbx:{{declaredName}}" {

  import type { QueryBuilder } from "@appril/dbx";

  {{#typeImports}}
  type {{as}} = import("{{from}}").{{import}};
  {{/typeImports}}

  {{#enumImports}}
  import type { {{.}} } from "./enums";
  {{/enumImports}}

  export type RecordT = {
  {{#columns}}

  {{#comments}}  /** {{.}} */
  {{/comments}}
    {{name}}: {{declaredType}};
  {{/columns}}
  }

  export type QueryT = QueryBuilder<"{{declaredName}}">;

}

{{/views}}

{{^tables.length}}
export {}
{{/tables.length}}

