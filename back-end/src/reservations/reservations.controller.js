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
    const reservationDate = new Date(req.body.data.date);
    const today = new Date();

    if (reservationDate.getDay() === 2) { // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
      return res.status(400).json({ error: "Reservations are not allowed on Tuesdays as the restaurant is closed." });
    }

    if (reservationDate < today) {
      return res.status(400).json({ error: "Past reservations are not allowed. Please choose a future date." });
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
  read:asyncErrorBoundary(read),
  create: asyncErrorBoundary(create),
  filterDate: asyncErrorBoundary(filterDate),
  list: asyncErrorBoundary(list),
  listByDateOrMobileNumber:asyncErrorBoundary(listByDateOrMobileNumber),
  updateReservation: asyncErrorBoundary(updateReservation),
  searchReservation: asyncErrorBoundary(searchReservation)
};

