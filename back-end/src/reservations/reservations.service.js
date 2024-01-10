const knex = require("../db/connection");



function read(reservation_id) {
  return knex("reservations")
  .select("*")
  .where({ reservation_id })
  .first()
}


function listByDate(date) {
 return knex("reservations")
 .select("*")
.where({ reservation_date: date })
.orderBy("reservations.reservation_time");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


async function list() {
  try {
    return await knex("reservations").select("*")
  } catch (error) {
    console.error("Error in reservations service:", error);
    throw error; 
  }
}


async function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(reservation_id, status) {
  return knex("reservations")
  .where({ reservation_id })
  .update({ status })
  .then(() => read(reservation_id))
};

function updateReservation(reservation_id, updatedFields) {
  return knex("reservations")
    .where({ reservation_id })
    .update(updatedFields)
}


  async function getReservationById(reservationId) {
    return await knex('reservations').where({ reservation_id: reservationId }).first();
  }



module.exports = {
  list,
  listByDate,
  create,
  search,
  read,
  update,
  getReservationById,
  updateReservation,
};







