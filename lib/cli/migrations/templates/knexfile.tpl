
import dbxConfig from "~/{{dbxfile}}";

{{#files}}
import * as {{const}} from "~/{{base}}/{{migrationDir}}/{{path}}";
{{/files}}

const imports: Record<string, any> = {
{{#files}}
  "{{path}}": {{const}},
{{/files}}
}

class MigrationSource {

  // Must return a Promise containing a list of migrations.
  // Migrations can be whatever you want,
  // they will be passed as arguments to getMigrationName
  // and getMigration
  getMigrations() {
    return Promise.resolve([
      {{#files}}
      "{{path}}",
      {{/files}}
    ])
  }

  getMigrationName(file: string) {
    return file
  }

  getMigration(file: string) {
    return imports[file]
  }

}

const {
  connection,
  client,
  migrationSchema,
  migrationTable,
  disableTransactions,
} = dbxConfig

const config = {
  connection,
  client,
  migrations: {
    migrationSource: new MigrationSource,
    disableTransactions,
    ...migrationSchema
      ? { schemaName: migrationSchema }
      : {},
    ...migrationTable
      ? { tableName: migrationTable }
      : {},
  },
}

export default {
  development: config,
  test: config,
  stage: config,
  production: config,
}

