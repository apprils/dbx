
{{#tables}}
export { default as {{declaredName}} } from "./{{name}}";
{{/tables}}

{{^tables.length}}
export {}
{{/tables.length}}

