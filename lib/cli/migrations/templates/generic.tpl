
import type { Knex } from "knex";
{{#table}}

const table = "{{table}}"
{{/table}}

export function up(knex: Knex) {
  // return knex.schema
}

export function down(knex: Knex) {
  // return knex.schema
}

