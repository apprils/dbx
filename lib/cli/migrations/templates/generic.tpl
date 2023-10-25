
import { Knex } from "knex";
{{#table}}

const table = "{{table}}"
{{/table}}

export function up(knex: Knex): Promise<void> {
  // return knex.schema
}

export function down(knex: Knex): Promise<void> {
  // return knex.schema
}

