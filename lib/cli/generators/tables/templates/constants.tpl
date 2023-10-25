
{{#tables}}
export const {{constant}} = "{{name}}";
{{/tables}}

{{^tables.length}}
export {}
{{/tables.length}}

