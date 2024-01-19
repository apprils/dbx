
declare module "@dbx:{{declaredName}}/tMap" {

  export type {
    RecordT as {{recordName}},
    {{#isTable}}
    InsertT as {{insertName}},
    UpdateT as {{updateName}},
    {{/isTable}}
    QueryT as {{queryBuilder}},
  } from "@dbx:{{declaredName}}";

}

