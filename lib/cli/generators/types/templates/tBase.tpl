
declare module "{{base}}:{{name}}/tBase" {

  {{#typeImports}}
  import type { {{import}} as {{as}} } from "{{from}}";
  {{/typeImports}}

  {{#enumImports}}
  import type { {{.}} } from "{{base}}::enums";
  {{/enumImports}}

  {{! using prefixes to avoid type name collisions }}
  {{! eg. when RecordT imported by typeImports }}

  type {{declaredName}}$RecordT = {
  {{#columns}}

{{#comments}}    /** {{.}} */
{{/comments}}
    {{name}}: {{declaredType}};
  {{/columns}}
  }

  {{#isTable}}

  type {{declaredName}}$InsertT = {
  {{#columns}}

{{#comments}}    /** {{.}} */
{{/comments}}
    {{^isGenerated}}{{name}}{{#isOptional}}?{{/isOptional}}: {{declaredType}};
    {{/isGenerated}}
  {{/columns}}
  }

  type {{declaredName}}$UpdateT = {
  {{#columns}}

{{#comments}}    /** {{.}} */
{{/comments}}
    {{^isGenerated}}{{name}}?: {{declaredType}};
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
  };

}

