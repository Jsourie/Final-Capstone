// reservations.controller.js

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



async function read(req, res) {
  const { reservationId } = req.params;

  try {
    const reservation = await service.read(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: `${reservationId} Reservation not found` });
    }

    res.json({ data: reservation });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



async function filterDate(req, res) {
  try {
    const date = req.query.date;
    const data = await service.listDate(date);
    res.json({ data });
  } catch (error) {
    console.error("Error in reservations controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
///////////////////////////////CREATE//////////

async function validateAndCreate(req, res) {
  try {
    // Validate data is present
    if (!req.body.data) {
      return res.status(400).json({ error: 'Data is missing.' });
    }

    // Validate required fields are not missing or empty
    const requiredFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people'];
    const emptyFields = requiredFields.filter(field => !req.body.data[field] || req.body.data[field] === "");

    if (emptyFields.length > 0) {
      return res.status(400).json({ error: `${emptyFields.join(', ')} ${emptyFields.length > 1 ? 'are' : 'is'} required.` });
    }

    // Validate reservation_date is a date
    const { reservation_date } = req.body.data;
    const dateFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;

    if (!dateFormat.test(reservation_date)) {
      return res.status(400).json({ error: `Invalid date format for reservation_date.` });
    }

    // Validate reservation_time is a time
    const { reservation_time } = req.body.data;
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!reservation_time || !reservation_time.match(timeRegex)) {
      return res.status(400).json({ error: 'Invalid time format for reservation_time.' });
    }

    // Validate people is a number
    
    const { people } = req.body.data;

    if (!people || !Number.isInteger(people) || people <= 0) {
      return res.status(400).json({ error: "people must be a number" });
    }
    

    // Validate time constraints
    const currentDate = new Date();
    const selectedDateTime = new Date(`${reservation_date} ${reservation_time}`);
    const openingTime = new Date(`${reservation_date} 10:30:00`);
    const closingTime = new Date(`${reservation_date} 21:30:00`);

    // Validate reservation_date is a Tuesday
    if (selectedDateTime.getDay() === 2) {
      return res.status(400).json({ error: "The restaurant is closed on Tuesdays." });
    }

    // Validate reservation_date is in the future
    if (selectedDateTime <= currentDate) {
      return res.status(400).json({ error: "Reservation date must be in the future." });
    }

    // Validate reservation_time is after 10:30 AM
    if (selectedDateTime < openingTime) {
      return res.status(400).json({ error: "Reservation time must be after 10:30 AM." });
    }

    // Validate reservation_time is before 9:30 PM
    if (selectedDateTime > closingTime) {
      return res.status(400).json({ error: "Reservation time must be before 9:30 PM." });
    }
    
    const {status} = req.body.data
    if ( status === "finished") {
      return res.status(400).json({ error: "finished" });
    }

    if (status==="seated"){
      return res.status(400).json({ error: "seated" });
    }

    // If all validations pass, proceed with creating the reservation
    const data = await service.create(req.body.data);
    res.status(201).json({ data });

  } catch (error) {
    console.error("Error in reservations controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
////////////////////////////////////////////////////////////////////

async function list(req, res) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    console.error("Error in reservations controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function searchReservation(req, res, next) {
  try {
    const { mobile_number } = req.query;
    const reservations = await service.search(mobile_number);
    res.json({ data: reservations });
  } catch (error) {
    next(error);
  }
}

async function listByDateOrMobileNumber(req, res) {
  try {
    const { date, mobile_number } = req.query;

    if (date && mobile_number) {
      return res.status(400).json({
        error: "Please provide either 'date' or 'mobile_number', not both.",
      });
    }

    let data;
    if (date) {
      data = await service.listByDate(date);
    } else if (mobile_number) {
      data = await service.search(mobile_number);
    } else {
      data = await service.list();
    }

    data = data.filter(reservation => reservation.status !== 'finished');

    res.json({ data });
  } catch (error) {
    console.error("Error in reservations controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

////////////////
async function updateStatus(req, res, next) {
  try {
    // Check if the reservation is not finished
    if (res.locals.reservation.status === 'finished') {
      return res.status(400).json({ error: 'Reservation already finished.' });
    }

    // Validate the new status
    const { status } = req.body.data;
    const VALID_FIELDS = ['booked', 'seated', 'finished'];
    if (!status || !VALID_FIELDS.includes(status)) {
      return next({
        status: 400,
        message: `Invalid status: ${status}`,
      });
    }

    const { reservation_id } = res.locals.reservation;
  const updatedReservation = await service.update(reservation_id, status);

    // Respond with the updated data
    res.json({ data: updatedReservation });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    next({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}


async function reservationExists(req, res, next) {
  const { reservationId } = req.params

  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation'${reservationId}' not found.`
  })
}

//////////////////////update reservation///////////

async function updateReservation(req, res, next) {
  try {
    // Validate if data is missing
    if (!req.body.data) {
      return res.status(400).json({ error: 'Data is missing.' });
    }

    // Validate required fields are not missing or empty
    const requiredFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people'];
    const emptyFields = requiredFields.filter(field => !req.body.data[field] || req.body.data[field] === "");

    if (emptyFields.length > 0) {
      return res.status(400).json({ error: `${emptyFields.join(', ')} ${emptyFields.length > 1 ? 'are' : 'is'} required.` });
    }

    // Validate reservation_date is a date
    const { reservation_date } = req.body.data;
    const dateFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;

    if (!dateFormat.test(reservation_date)) {
      return res.status(400).json({ error: `Invalid date format for reservation_date.` });
    }

    // Validate reservation_time is a time
    const { reservation_time } = req.body.data;
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!reservation_time || !reservation_time.match(timeRegex)) {
      return res.status(400).json({ error: 'Invalid time format for reservation_time.' });
    }

    // Validate people is a number
    const { people } = req.body.data;

    if (!Number.isInteger(people) || people <= 0) {
      return res.status(400).json({ error: "people must be a positive integer." });
    }

    // Proceed with updating the reservation if all validations pass
    const { reservation_id } = req.params; 
    const updatedFields = { ...req.body.data }; 

    const updatedReservation = await service.updateReservation(reservation_id, updatedFields);

    // Respond with the updated data
    res.json({ data: updatedReservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    next({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}



module.exports = {
  read: asyncErrorBoundary(read),
  create: asyncErrorBoundary(validateAndCreate),
  filterDate: asyncErrorBoundary(filterDate),
  list: asyncErrorBoundary(list),
  listByDateOrMobileNumber: asyncErrorBoundary(listByDateOrMobileNumber),
  searchReservation: asyncErrorBoundary(searchReservation),
  update:[asyncErrorBoundary(reservationExists),asyncErrorBoundary(updateStatus)],
  updateReservation:[asyncErrorBoundary(reservationExists),asyncErrorBoundary(updateReservation)],
};
