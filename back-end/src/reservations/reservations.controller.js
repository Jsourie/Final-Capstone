// reservations.controller.js

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function read(req, res) {
  const { reservation_id } = req.params;
  try {
    const reservation = await service.read(reservation_id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
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


async function create(req, res) {
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
    const dateRegex = /^(?<year>\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(req.body.data.reservation_date)) {
      return res.status(400).json({ error: 'Reservation date must be a valid date.' });
    }

    // Validate reservation_time is a time
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!req.body.data.reservation_time || req.body.data.reservation_time.match(timeRegex)) {
      return res.status(400).json({ error: 'Invalid time format for reservation_time.' });
    }

    // Validate people is a number
    const parsedPeople = parseInt(req.body.data.people, 10);
    if (isNaN(parsedPeople) || parsedPeople < 1) {
      return res.status(400).json({ error: 'Number of people must be a valid number greater than 0.' });
    }

    const data = await service.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    console.error("Error in reservations controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}





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

    res.json({ data });
  } catch (error) {
    console.error("Error in reservations controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateReservation(req, res, next) {
  const newStatus = req.body.data.status;

  const validStatuses = ['booked', 'seated', 'finished', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updatedReservation = {
    ...res.locals.reservations,
    status: newStatus,
    reservation_id: res.locals.reservations.reservation_id,
  };

  try {
    const updatedData = await service.update(updatedReservation);
    const responseData = {
      ...updatedData,
    };
    res.json({ data: responseData });
  } catch (error) {
    console.error("Error updating reservation:", error);
    next(error);
  }
}

module.exports = {
  read: asyncErrorBoundary(read),
  create: asyncErrorBoundary(create),
  filterDate: asyncErrorBoundary(filterDate),
  list: asyncErrorBoundary(list),
  listByDateOrMobileNumber: asyncErrorBoundary(listByDateOrMobileNumber),
  updateReservation: asyncErrorBoundary(updateReservation),
  searchReservation: asyncErrorBoundary(searchReservation),
};
