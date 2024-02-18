{{BANNER}}

{{#enums}}
{{#comment}}/** {{comment}} */{{/comment}}
export enum {{declaredName}} {
{{#values}}
  "{{.}}" = "{{.}}",
{{/values}}
};

export type {{declaredName}}{{enumUnionSuffix}} =
{{#values}}  | "{{.}}"
{{/values}};

{{/enums}}

{{#typeImports}}
{{text}}
{{/typeImports}}

{{#tables}}
/** {{name}} */

export type {{recordName}} = {
{{#columns}}

{{#comments}}  /** {{.}} */
{{/comments}}
  {{name}}: {{declaredType}};
{{/columns}}
}

export type {{insertName}} = {
{{#columns}}

{{#comments}}  /** {{.}} */
{{/comments}}
{{^isGenerated}}  {{name}}{{#isOptional}}?{{/isOptional}}: {{declaredType}};
{{/isGenerated}}
{{/columns}}
}

export type {{updateName}} = {
{{#columns}}

{{#comments}}  /** {{.}} */
{{/comments}}
{{^isGenerated}}  {{name}}?: {{declaredType}};
{{/isGenerated}}
{{/columns}}
}

export type {{queryBuilder}} = import("@appril/dbx").QueryBuilder<"{{base}}:{{name}}">;

{{/tables}}

{{#views}}
/** {{name}} */

export type {{recordName}} = {
{{#columns}}

{{#comments}}  /** {{.}} */
{{/comments}}
  {{name}}: {{declaredType}};
{{/columns}}
}

export type {{queryBuilder}} = import("@appril/dbx").QueryBuilder<"{{base}}:{{name}}">;

{{/views}}

