{{BANNER}}

{{#tables}}
{{tBaseModule}}
{{tExtraModule}}
{{tIndexModule}}
{{/tables}}

{{#views}}
{{tBaseModule}}
{{tExtraModule}}
{{tIndexModule}}
{{/views}}

{{! intermediate enums module needed to avoid circular dependencies }}
{{! eg. when dbx namespace imports tBase and tBase imports enums from dbx }}
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

declare namespace dbx {

  export * from "@dbx/enums";

  {{#tables}}
  export namespace {{declaredName}} {
    export * from "@dbx:{{declaredName}}";
  }

  {{/tables}}

  {{#views}}
  export namespace {{declaredName}} {
    export * from "@dbx:{{declaredName}}";
  }

  {{/views}}

}

