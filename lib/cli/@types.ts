
import type { ConnectionConfig } from "pg"

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
  enums?: string;
  index?: string;
}

export type TablesTemplates = {
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

