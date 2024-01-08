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
/////////////////////////////////////////////////////////////////////////////////////
async function updateTable(tableId, reservationId) {
  
  const updatedTable = await knex("tables")
    .where({ table_id: tableId })
    .update({ reservation_id: reservationId }, "*")
    .then((tables) => tables[0]);

  await knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: "seated" });

  return updatedTable;
}




async function deleteSeat(tableId, reservationId) {
  const seatFinished = await knex("tables")
    .where({ table_id: tableId })
    .update({ reservation_id: null }, "*")
    .then((seats) => seats[0]);

    await knex("reservations")
      .where({ reservation_id: reservationId })
      .update({ status: "finished" });

  return seatFinished;
}



  async function getTableById(tableId) {
    return await knex('tables').select('*').where({ table_id: tableId }).first();
  }



  async function getReservationById(reservationId) {
    return await knex('reservations').where({ reservation_id: reservationId }).first();
  }

module.exports = {
  list,
  create,
  updateTable,
  getTableById,
  getReservationById,
  deleteSeat
};

