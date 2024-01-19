
declare module "@dbx:{{declaredName}}/tExtra" {

  export type TExtraMethod = (
    this: import("@dbx:{{declaredName}}").QueryT,
    ...a: any[]
  ) => import("@dbx:{{declaredName}}").QueryT

  export type TExtra = Record<string, TExtraMethod>

}

