
{{#tables}}
export { default as {{declaredName}} } from "./{{declaredName}}";
{{/tables}}

{{^tables.length}}
export {}
{{/tables.length}}

