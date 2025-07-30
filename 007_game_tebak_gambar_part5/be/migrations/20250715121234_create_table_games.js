/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("games", (table) => {
    table.increments("id").notNullable().primary();
    table.string("player_name", 128).notNullable();
    table.integer("score").notNullable();
    table.integer("live").notNullable();
    table.integer("level").notNullable();
    table.jsonb("logo_images").notNullable();
    table.datetime("created_at").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable("games");
};
