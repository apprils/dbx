
declare module "@dbx:{{declaredName}}/tBase" {

  {{#typeImports}}
  type {{as}} = import("{{from}}").{{import}};
  {{/typeImports}}

  {{#enumImports}}
  type {{.}} = import("@dbx/enums").{{.}};
  {{/enumImports}}

  {{! using prefixes to avoid type name collisions }}
  {{! eg. when RecordT imported by typeImports }}

  type {{declaredName}}$RecordT = {
    {{#columns}}

      {{#comments}}  /** {{.}} */
      {{/comments}}

      {{name}}: {{declaredType}};

    {{/columns}}
  }

  {{#isTable}}

  type {{declaredName}}$InsertT = {
    {{#columns}}

      {{#comments}}  /** {{.}} */
      {{/comments}}

      {{^isGenerated}}  {{name}}{{#isOptional}}?{{/isOptional}}: {{declaredType}};
      {{/isGenerated}}

    {{/columns}}
  }

  type {{declaredName}}$UpdateT = {
    {{#columns}}

      {{#comments}}  /** {{.}} */
      {{/comments}}

      {{^isGenerated}}  {{name}}?: {{declaredType}};
      {{/isGenerated}}

    {{/columns}}
  }

  {{/isTable}}

  export type {
    {{declaredName}}$RecordT as RecordT,
    {{#isTable}}
    {{declaredName}}$InsertT as InsertT,
    {{declaredName}}$UpdateT as UpdateT,
    {{/isTable}}
  }

}

