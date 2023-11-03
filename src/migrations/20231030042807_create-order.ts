import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order", (table) => {
    table.increments("id").primary(),
    table.text("title").notNullable(),
    table.enu('origin', ['Supplier', 'Client']).notNullable(),
    table.enu('category', ['Input', 'Output']).notNullable(),
    table.boolean("finished").defaultTo(false),
    table.date("dealine"),
    table.date("created_at").defaultTo(knex.fn.now()),
    table.integer("user_id"),
    table.foreign("user_id").references("user.id")
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("order")
}

