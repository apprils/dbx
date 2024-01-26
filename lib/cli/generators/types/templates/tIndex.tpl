
declare module "{{base}}:{{name}}" {

  export * from "{{base}}:{{name}}/tBase";

  export type QueryT = import("@appril/dbx").QueryBuilder<"{{base}}:{{name}}">;

}

