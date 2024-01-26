{{BANNER}}

{{! enums used on runtime so should reside in files rather than in ambient modules }}
{{#enums}}
{{#comment}}/** {{comment}} */{{/comment}}
export enum {{declaredName}} {
{{#values}}
  "{{.}}" = "{{.}}",
{{/values}}
};

export type {{declaredName}}{{unionSuffix}} =
{{#values}}| "{{.}}"
{{/values}};

{{/enums}}

