
import { Knex } from "knex";

const table = "{{table}}"

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(table, (t) => {
    
  })
}

export function down(knex: Knex): Promise<void> {
  // return knex.schema.alterTable(table, (t) => {})
}

