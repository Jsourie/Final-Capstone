import React from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";

function ListReservation({
  reservations,
  setReservationsError,
  loadReservationsAndTables,
}) {
  const filteredReservations = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );

  return (
    <div className="card-container">
      {filteredReservations.map((reservation) => (
        <div key={reservation.reservation_id} className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            {reservation.last_name}, {reservation.first_name}
            {reservation.status === "booked" && (
              <Link
                to={`/reservations/${reservation.reservation_id}/edit`}
                className="btn btn-outline-secondary"
              >
                Edit
              </Link>
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
            {reservation.status === "booked" && (
              <Link
                to={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-secondary"
              >
                Seat
              </Link>
            )}

            <h5>
              <span data-reservation-id-status={reservation.reservation_id}>
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
