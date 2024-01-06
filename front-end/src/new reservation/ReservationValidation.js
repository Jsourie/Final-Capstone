import React, { useState } from "react";

function ReservationValidation({ formData, onSubmit }) {
  const [errorMessage, setErrorMessage] = useState(null);

  const isInvalidReservation = () => {
    const today = new Date();
    const selectedDateTime = new Date(`${formData.reservation_date}  ${formData.reservation_time}`);
    const openingTime = new Date(`${formData.reservation_date} 10:30:00`);
    const closingTime = new Date(`${formData.reservation_date} 21:30:00`);
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
      errorMessages.push("Reservation time must be before 9:30 PM.");
    }

    if (errorMessages.length > 0) {
      setErrorMessage(errorMessages.join(" "));
      return true;
    } else {
      setErrorMessage(null);
      return false;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isInvalidReservation()) {
      return;
    }

    onSubmit();
  };

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default ReservationValidation