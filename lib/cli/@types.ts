
import type { ConnectionConfig } from "pg";

import type {
  Config as PgtsConfig,
  TableDeclaration, ViewDeclaration, EnumDeclaration,
} from "@appril/pgts";

export type { TableDeclaration, ViewDeclaration, EnumDeclaration }

export type TypesTemplates = {
  knexDts?: string;
  moduleDts?: string;
  tBase?: string;
  tExtra?: string;
  tIndex?: string;
  tMap?: string;
}

export type TablesTemplates = {
  base?: string;
  entry?: string;
  index?: string;
}

export type ViewsTemplates = TablesTemplates

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

type TypesRenderContextFactory<Base> = Base & {
  tBaseModule: string;
  tExtraModule: string;
  tIndexModule: string;
  tMapModule: string;
}

export type TypesRenderContext = {
  BANNER: string;
  enums: EnumDeclaration[];
  tables: TypesRenderContextFactory<TableDeclaration>[];
  views: TypesRenderContextFactory<ViewDeclaration>[];
}

export type TablesRenderContext = {
  BANNER: string;
  base: string;
  importBase: string;
  typesDir: string;
  tables: TableDeclaration[];
}

export type ViewsRenderContext = Omit<TablesRenderContext, "tables"> & {
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

