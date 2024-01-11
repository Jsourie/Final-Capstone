import React from "react";
import { listReservations } from "../utils/api";

function ListReservation({
  reservations,
  setReservationsError,
  loadReservationsAndTables,
}) {
  const handleSeat = (reservationId) => {
    window.location.href = `/reservations/${reservationId}/seat`;
  };

  const handleEdit = (reservationId) => {
    window.location.href = `/reservations/${reservationId}/edit`;
  };

  return (
    <div className="card-container">
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            {reservation.last_name}, {reservation.first_name}
            {reservation.status === "booked" && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleEdit(reservation.reservation_id)}
              >
                Edit
              </button>
            )}
          </div>

          <div className="card-body">
            <h5 className="card-title">
              {reservation.reservation_time}, {reservation.reservation_date}
            </h5>
            <h6 >Guests: {reservation.people}</h6>
            <h6 >
              Mobile Number: {reservation.mobile_number}
            </h6>
          </div>

          <div className="card-footer border-secondary text-secondary">
            {reservation.status === "booked" && (
              <button
                className="btn btn-secondary"
                onClick={() => handleSeat(reservation.reservation_id)}
              >
                Seat
              </button>
            )}

            <h5>
              <span
                data-reservation-id-status={reservation.reservation_id}
              >
                {reservation.status}
              </span>
            </h5>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListReservation;
