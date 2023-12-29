{{BANNER}}

{{#enums}}
{{#comment}}/** {{comment}} */{{/comment}}
export enum {{declaredName}} {
{{#values}}
  "{{.}}" = "{{.}}",
{{/values}}
}

export type {{declaredName}}{{unionSuffix}} =
{{#values}}| "{{.}}"
{{/values}}
{{/enums}}

{{^enums.length}}
export {}
{{/enums.length}}

