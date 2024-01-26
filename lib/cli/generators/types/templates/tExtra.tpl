
declare module "{{base}}:{{name}}/tExtra" {

  export type TExtraMethod = (
    this: import("{{base}}:{{name}}").QueryT,
    ...a: any[]
  ) => import("{{base}}:{{name}}").QueryT;

  export type TExtra = Record<string, TExtraMethod>;

}

