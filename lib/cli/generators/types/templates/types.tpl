
{{#tables}}
export * from "./{{declaredName}}";
{{/tables}}

{{#views}}
export * from "./{{declaredName}}";
{{/views}}

{{^tables.length}}
export {}
{{/tables.length}}

