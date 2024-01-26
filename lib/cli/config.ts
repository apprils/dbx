import type { DefaultConfig } from "./@types"

export const config: DefaultConfig = {
  schemas: ["public"],

  importBase: "~",

  typesDir: "types",
  tablesDir: "tables",
  viewsDir: "views",
}

export default config
