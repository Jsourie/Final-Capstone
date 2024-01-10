// ReservationList.js

import React from "react";
import { Link } from "react-router-dom";

function ReservationList({ reservations, onCancel }) {
  return (
    <div>
      {reservations.map((reservation) => (
        <div className="form-group row" key={reservation.reservation_id}>
          <div className="col-sm-1">{reservation.reservation_id}</div>
          <div className="col-sm-2">
            {reservation.last_name}, {reservation.first_name}
          </div>
          <div className="col-sm-2">{reservation.mobile_number}</div>
          <div className="col-sm-2">{reservation.reservation_date}</div>
          <div className="col-sm-1">{reservation.reservation_time}</div>
          <div className="col-sm-1">{reservation.people}</div>
          <div className="col-sm-1" data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </div>
          <div className="form-group row">
            {reservation.status === "booked" ? (
              <div>
                <Link
                  className="btn btn-primary"
                  to={`/reservations/${reservation.reservation_id}/seat`}
                >
                  seat
                </Link>
                <Link
                  className="btn btn-warning"
                  to={`/reservations/${reservation.reservation_id}/edit`}
                >
                  edit
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-reservation-id-cancel={reservation.reservation_id}
                  onClick={() => onCancel(reservation.reservation_id)}
                >
                  cancel
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReservationList;
