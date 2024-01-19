{{BANNER}}

{{#tables}}
export { default as {{declaredName}} } from "./{{schema}}/{{name}}";

{{/tables}}

// for cases when there are no tables
export {}

