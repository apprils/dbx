{{BANNER}}

{{#tables}}
{{tBaseModule}}
{{tExtraModule}}
{{tIndexModule}}
{{tMapModule}}
{{/tables}}

{{#views}}
{{tBaseModule}}
{{tExtraModule}}
{{tIndexModule}}
{{tMapModule}}
{{/views}}

{{! intermediate enums module to avoid circular dependencies }}
{{! when @dbx imports tBase and tBase imports enums from @dbx }}
declare module "@dbx/enums" {

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

}

declare module "@dbx" {

  export * from "@dbx/enums";

  {{#tables}}
  export * from "@dbx:{{declaredName}}/tMap";

  {{/tables}}

  {{#views}}
  export * from "@dbx:{{declaredName}}/tMap";

  {{/views}}

}

