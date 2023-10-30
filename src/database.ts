import { Knex, knex as knexSetup } from "knex";

export const configs: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: "./db/app.db"
  },
  migrations: {
    extension: "ts",    
    directory: "./src/migrations"
  },
  useNullAsDefault: true
}

export const knex = knexSetup(configs)