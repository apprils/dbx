{{BANNER}}

{{#tables}}
export { default as {{declaredName}} } from "./tables/{{schema}}/{{name}}";

{{/tables}}

{{#views}}
export { default as {{declaredName}} } from "./views/{{schema}}/{{name}}";

{{/views}}

