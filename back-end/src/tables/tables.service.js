const knex = require("../db/connection");



async function list() {
  try {
    return await knex("tables").select("*");
  } catch (error) {
    console.error("Error in tables service:", error);
    throw error; 
  }
}


async function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function updateTable(tableId, reservationId) {
    return knex("tables")
      .where({ table_id: tableId })
      .update({ reservation_id: reservationId }, "*")
      .then((tables) => tables[0]);
  }

  function deleteSeat(tableId) {
    return knex("tables")
      .where({ table_id: tableId })
      .update({ reservation_id: null}, "*")
      .then((seats) => seats[0]);
  }

module.exports = {
  list,
  create,
  updateTable,
  deleteSeat
};

