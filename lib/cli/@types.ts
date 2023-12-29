
import type { ConnectionConfig } from "pg";

import type {
  Config as PgtsConfig,
  TableDeclaration, ViewDeclaration, EnumDeclaration,
} from "@appril/pgts";

export type { TableDeclaration, ViewDeclaration, EnumDeclaration }

export type TypesTemplates = {
  enums?: string;
  index?: string;
  knex?: string;
  moduleDts?: string;
}

export type TablesTemplates = {
  table?: string;
  constants?: string;
  constructors?: string;
  schemaIndex?: string;
}

export type ViewsTemplates = {
  view?: string;
  constants?: string;
  constructors?: string;
  schemaIndex?: string;
}

export type MigrationsTemplates = {
  createTable?: string;
  alterTable?: string;
  dropTable?: string;
  generic?: string;
  knexfile?: string;
}

export type Config = PgtsConfig & {

  connection: string | ConnectionConfig;
  client: string;

  base: string;
  importBase?: string;

  typesDir?: string;
  typesTemplates?: TypesTemplates;

  tablesDir?: string;
  tablesTemplates?: TablesTemplates;

  viewsDir?: string;
  viewsTemplates?: ViewsTemplates;

  migrationDir: string;
  migrationSubdir?: string;
  migrationTemplates?: MigrationsTemplates;
  migrationSchema?: string;
  migrationTable?: string;
  disableTransactions?: boolean;

}

export type DefaultConfig = Required<
  Pick<
    Config,
    | "schemas"
    | "importBase"
    | "typesDir"
    | "tablesDir"
    | "viewsDir"
  >
>

export type GeneratorConfig = Config & DefaultConfig
export type MigrationsConfig = Config & DefaultConfig

export type TypesRenderContext = {
  schema: string;
  enums: EnumDeclaration[];
  tables: TableDeclaration[];
  views: ViewDeclaration[];
}

export type TablesRenderContext = {
  schema: string;
  base: string;
  importBase: string;
  typesDir: string;
  tables: TableDeclaration[];
}

export type ViewsRenderContext = {
  schema: string;
  base: string;
  importBase: string;
  typesDir: string;
  views: ViewDeclaration[];
}

export type MigrationsSourceFile = {
  path: string;
  const: string;
}

export type MigrationsSourceRenderContext = MigrationsConfig & {
  dbxfile: string;
  files: MigrationsSourceFile[];
}

