
{{#views}}
export { default as {{declaredName}} } from "./{{name}}";
{{/views}}

{{^views.length}}
export {}
{{/views.length}}

