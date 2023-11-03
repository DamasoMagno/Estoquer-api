import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orderItem", (table) => {
    table.increments("id").primary(),
    table.text("name"),
    table.integer("price"),
    table.integer("quantity"),
    table.integer("order_id"),
    table.foreign("order_id").references("order.id")
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orderItem")
}

