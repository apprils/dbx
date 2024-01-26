{{BANNER}}

declare module "{{base}}::enums" {
  import("./enums");
  export * from "./enums";
}

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

