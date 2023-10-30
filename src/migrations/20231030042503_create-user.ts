import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (table) => {
    table.increments("id"),
    table.text("name"),
    table.text("email"),
    table.text("password")
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user")
}

