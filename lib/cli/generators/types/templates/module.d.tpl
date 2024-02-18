{{BANNER}}

{{#tables}}
declare module "{{base}}:{{name}}" {

  export { {{recordName}} as RecordT } from "./index";
  export { {{insertName}} as InsertT } from "./index";
  export { {{updateName}} as UpdateT } from "./index";
  export { {{queryBuilder}} as QueryT } from "./index";

  export type TExtraMethod = (
    this: import("./index").{{queryBuilder}},
    ...a: never[]
  ) => import("./index").{{queryBuilder}} | TExtraMethod;

  export type TExtra = Record<string, TExtraMethod>;
}

{{/tables}}

{{#views}}
declare module "{{base}}:{{name}}" {

  export { {{recordName}} as RecordT } from "./index";
  export { {{queryBuilder}} as QueryT } from "./index";

  export type TExtraMethod = (
    this: import("./index").{{queryBuilder}},
    ...a: never[]
  ) => import("./index").{{queryBuilder}} | TExtraMethod;

  export type TExtra = Record<string, TExtraMethod>;
}

{{/views}}

