import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order", (table) => {
    table.increments("id").primary(),
    table.text("title"),
    table.text("origin"),
    table.text("category"),
    table.boolean("finished"),
    table.dateTime("created_at"),
    table.dateTime("dealine"),
    table.text("user_id"),
    table.foreign("user_id").references("user.id")
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("order")
}

