import React, { useState } from "react";
import { listReservations, cancelReservation } from "../utils/api";
import ListReservation from "./ListReservation"; // Import the ListReservation component

function SearchReservation() {
  const [reservations, setReservations] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState(null);

  const handleChange = ({ target: { value } }) => {
    setMobileNumber(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadReservations();
  };

  const loadReservations = () => {
    listReservations({ mobile_number: mobileNumber })
      .then(setReservations)
      .catch(setErrors);
  };


  // Use the ListReservation component here
  const reservationList = reservations.length ? (
    <ListReservation
      reservations={reservations}
      setReservationsError={setErrors}
      loadReservationsAndTables={loadReservations}
    />
  ) : <p>No reservations found</p>;

  return (
    <main>
      <h3>Search for reservation by phone number</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            className="form-control"
            onChange={handleChange}
            value={mobileNumber}
            placeholder="mobile number"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      {reservationList}
    </main>
  );
}

export default SearchReservation;
