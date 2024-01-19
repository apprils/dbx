
declare module "@dbx:{{declaredName}}" {

  export * from "@dbx:{{declaredName}}/tBase";

  export type QueryT = import("@appril/dbx").QueryBuilder<"{{declaredName}}">;

}

