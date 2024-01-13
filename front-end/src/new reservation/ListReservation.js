import React from "react";
import { Link } from "react-router-dom";
import { listReservations, cancelReservation } from "../utils/api";

function ListReservation({
  reservations,
  setReservationsError,
  loadReservationsAndTables,
}) {
    const filteredReservations = reservations.filter(
        (reservation) => reservation.status !== "finished" && reservation.status !== "cancelled"
      );
      

  const onCancel = (reservation_id) => {
    const abortController = new AbortController();
    const message = "Do you want to cancel this reservation?";
  
    if (window.confirm(message)) {
      cancelReservation(reservation_id, 'cancelled', abortController.signal)
        .then(() => loadReservationsAndTables())
        .catch((error) => {
          setReservationsError(error);
        });
    }
  
  };
  

  return (
    <div className="card-container">
      {filteredReservations.map((reservation) => (
        <div key={reservation.reservation_id} className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            {reservation.last_name}, {reservation.first_name}
            {reservation.status === "booked" && (
              <>
                <Link
                  to={`/reservations/${reservation.reservation_id}/edit`}
                  className="btn btn-outline-secondary mr-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => onCancel(reservation.reservation_id)}
                  data-reservation-id-cancel={reservation.reservation_id}
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="card-body">
            <h5 className="card-title">
              {reservation.reservation_time}, {reservation.reservation_date}
            </h5>
            <h6>Guests: {reservation.people}</h6>
            <h6>Mobile Number: {reservation.mobile_number}</h6>
          </div>

          <div className="card-footer border-secondary text-secondary">
            {reservation.status === "booked" && reservation.status !== "seated" && (
              <Link
                to={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-secondary mr-2"
              >
                Seat
              </Link>
            )}

            <h5 data-reservation-id-status={reservation.reservation_id}>
              {reservation.status}
            </h5>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListReservation;

