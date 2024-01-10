import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";

function SearchReservation() {
  const history = useHistory();

  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservations, setReservations] = useState([]);
  const [searched, setSearched] = useState(false);

  const { mobile_number } = formData;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    listReservations({ mobile_number })
      .then((fetchedReservations) => {
        setReservations(fetchedReservations);
        setSearched(true);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setReservations([]);
        setSearched(true);
      });
  };

  const handleCancel = (reservationId) => {
    // Implement the cancellation logic here
    console.log(`Cancel reservation with ID: ${reservationId}`);
  };

  const reservationList = searched && reservations.length === 0 ? (
    <p>No reservations found</p>
  ) : (
    <ReservationList reservations={reservations} onCancel={handleCancel} />
  );

  return (
    <div className="container">
      <h1>Reservation Search</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mobile_number">Phone Number</label>
              <input
                type="tel"
                name="mobile_number"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                value={mobile_number}
                onChange={handleInputChange}
                placeholder="e.g., 555-123-4567"
                required
              />
            </div>
            <div className="text-center">
              <button onClick={() => history.goBack()} className="btn btn-danger mr-2">
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Find
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>{reservationList}</div>
    </div>
  );
}

export default SearchReservation;
