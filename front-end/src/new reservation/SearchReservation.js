import React, { useState } from "react";
import { useHistory,Link } from "react-router-dom";
import { listReservations } from "../utils/api";

function SearchReservation() {
  const history = useHistory();

  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [errorMessage, setErrorMessage] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

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
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setReservations([]);
        setErrorMessage(error.message);
      });
  };

  const handleCancel = () => {
    history.goBack();
  };

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
              <button
                onClick={handleCancel}
                className="btn btn-danger mr-2"
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        {reservations.map((reservation) => (
          <div key={reservation.reservation_id}>
            <p>
              {reservation.first_name} {reservation.last_name}
              {reservation.people}
              <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-secondary">Edit</button>
           </Link>
            </p>
          </div>
        ))}
        {reservationsError && <p>Error: {reservationsError}</p>}
      </div>
    </div>
  );
}

export default SearchReservation;
