const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function create(req, res) {
  try {
    // Validations

    if (!req.body.data) {
      return res.status(400).json({ error: 'Data is missing.' });
    }

    const requiredFields = ['table_name', 'capacity'];
    const emptyFields = requiredFields.filter(field => !req.body.data[field] || req.body.data[field] === "");

    if (emptyFields.length > 0) {
      return res.status(400).json({ error: `${emptyFields.join(', ')} ${emptyFields.length > 1 ? 'are' : 'is'} required.` });
    }

    // Check if table_name is at least 2 characters long
    if (req.body.data.table_name.length <= 1) {
      return res.status(400).json({ error: "table_name must be at least 2 characters long." });
    }

    // Check if capacity is at least 1 person
    if (!Number.isInteger(req.body.data.capacity) || req.body.data.capacity < 1) {
      return res.status(400).json({ error: "capacity must be a number greater than 0." });
    }

    // Proceed with table creation if validations pass
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    console.error("Error in tables controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}





async function list(req, res) {
  try {
    const data = await service.list();
    const sortedTables = data.sort((a, b) => a.table_name.localeCompare(b.table_name));
    res.json({ data: sortedTables });
  } catch (error) {
    console.error("Error in tables controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function seatReservation(req, res, next) {
  const { table_id } = req.params;

  try {
    // Validate if data is missing
    if (!req.body.data) {
      return res.status(400).json({ error: 'Data is missing.' });
    }

    const { reservation_id } = req.body.data;

    // Validate if reservation_id is missing
    if (!reservation_id) {
      return res.status(400).json({ error: 'reservation_id is missing.' });
    }

    // Check if the table exists
    const table = await service.getTableById(table_id);
    if (!table) {
      return res.status(404).json({ error: "table_id not found." });
    }

    // Check if the reservation exists
    const reservation = await service.getReservationById(reservation_id);
    if (!reservation) {
      return res.status(404).json({ error: `Reservation with ID ${reservation_id} not found.` });
    }


   if (reservation.status === 'seated') {
  return res.status(400).json({ error: "Reservation is already seated." });
  }

    // Check if the table is occupied
    if (table.reservation_id) {
      return res.status(400).json({ error: "Table is occupied." });
    }

  
    // Check if the table has sufficient capacity
    if (table.capacity < reservation.people) {
      return res.status(400).json({ error: "Table does not have sufficient capacity." });
    }

    // Proceed with seating the reservation if all validations pass
    await service.updateTable(table_id, reservation_id);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}




async function read(req, res) {
  try {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if (!table) {
      return res.status(404).json({ error: 'Table not found.' });
    }

    res.json({ data: table });
  } catch (error) {
    console.error("Error in tables controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



async function destroy(req, res, next) {
  const { table_id } = req.params;

  try {
    const table = await service.getTableById(table_id);

    if (!table) {
      return res.status(404).json({ error: `${table_id} not found.` });
    }

    // Return 400 if the table is not occupied
    if (table.reservation_id === null) {
      return res.status(400).json({ error: `${table_id} not occupied.` });
    }

    const { reservation_id } = table;

    // Proceed with deleting the seat
    const updatedTable = await service.deleteSeat(table_id, reservation_id);

    // Return a JSON response with the updated data
    res.status(200).json({ message: "Seat deleted successfully", updatedTable });
  } catch (error) {
    next(error);
  }
}


  

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  seatReservation: asyncErrorBoundary(seatReservation),
  destroy:asyncErrorBoundary(destroy),
  read: asyncErrorBoundary (read)
};

