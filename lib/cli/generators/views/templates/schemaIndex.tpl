
{{#views}}
export { default as {{declaredName}} } from "./{{declaredName}}";
{{/views}}

{{^views.length}}
export {}
{{/views.length}}

