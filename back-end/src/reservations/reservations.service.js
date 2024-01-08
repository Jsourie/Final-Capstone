const knex = require("../db/connection");



async function read(reservationId) {
    return await knex('reservations').where({ reservation_id: reservationId }).first();
  }


async function listByDate(date) {
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


function update(reservationId, updatedReservation) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update(updatedReservation, "*")
    .then((reservations) => reservations[0]);
}

async function updateStatus(reservationId, status) {
    try {
      const updatedRows = await knex('reservations')
        .where({ reservation_id: reservationId })
        .update({ status: status });
  
      if (updatedRows === 0) {
        throw new Error('No rows updated. Reservation not found.');
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error in updateStatus function:', error);
      throw error;
    }
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
  updateStatus,
  getReservationById,
};







