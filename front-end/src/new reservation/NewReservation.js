import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import NewReservationForm from "./NewReservationForm";

function NewReservation() {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [reservation, setReservation] = useState({ ...initialFormState });
  const [errors, setErrors] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReservation((prevReservation) => ({
      ...prevReservation,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const today = new Date();
    const selectedDateTime = new Date(
      `${reservation.reservation_date}  ${reservation.reservation_time}`
    );
    const openingTime = new Date(`${reservation.reservation_date} 10:30:00`);
    const closingTime = new Date(`${reservation.reservation_date} 21:30:00`);
    const errorMessages = [];

    if (selectedDateTime.getDay() === 2) {
      errorMessages.push("The restaurant is closed on Tuesdays.");
    }

    if (selectedDateTime < today) {
      errorMessages.push("Reservation date must be in the future.");
    }

    if (selectedDateTime < openingTime) {
      errorMessages.push("Reservation time must be after 10:30 AM.");
    }

    if (selectedDateTime > closingTime) {
      errorMessages.push("Reservation time must be before 10:30 PM.");
    }

    if (errorMessages.length > 0) {
      setErrors(errorMessages);
      return;
    }

    createReservation(reservation)
      .then(() => {
        setReservation({ ...initialFormState });
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
      });
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <p>ERROR:</p>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <NewReservationForm
        formData={reservation}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        goBack={goBack}
      />
    </div>
  );
}

export default NewReservation;
