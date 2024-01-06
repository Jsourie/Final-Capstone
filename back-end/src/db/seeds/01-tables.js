const tables = require("./01-tables.json");

exports.seed = function (knex) {
  return knex.schema
    .hasTable("tables")
    .then((exists) => {
      if (exists) {
        return knex("tables").truncate(); 
      } else {
        console.error('Table "tables" does not exist.');
      }
    })
    .then(() => knex("tables").insert(tables))
    .catch((error) => {
      console.error("Error seeding tables:", error);
    });
};