
import type { Knex } from "knex";

const table = "{{table}}"

export function up(knex: Knex) {
  return knex.schema.createTable(table, (t) => {
    
  })
}

export function down(knex: Knex) {
  // return knex.schema.dropTable(table)
}

