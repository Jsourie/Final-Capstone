import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import NewReservationForm from "./NewReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservationErrors, setReservationErrors] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();



    setReservationErrors([]);
     const errors = [];

    const today = new Date();
    const selectedDateTime = new Date(
      `${formData.reservation_date}  ${formData.reservation_time}`
    );
    const openingTime = new Date(`${formData.reservation_date} 10:30:00`);
    const closingTime = new Date(`${formData.reservation_date} 22:30:00`);

    if (selectedDateTime.getDay() === 2) {
      errors.push("The restaurant is closed on Tuesdays.");
    }

    if (selectedDateTime > closingTime) {
      errors.push("Reservation time must be before 10:30 PM.");
    }

    if (selectedDateTime < today) {
      errors.push("Reservation date must be in the future.");
    }

    if (selectedDateTime < openingTime) {
      errors.push("Reservation time must be after 10:30 AM.");
    }

    setReservationErrors(errors);

    if (!errors.length) {
      createReservation(formData)
        .then(() => {
          setFormData({ ...initialFormState });
          const reservationDate = formData.reservation_date;
          const dashboardRoute = `/dashboard?date=${reservationDate}`;
          history.push(dashboardRoute);
        })
        .catch((error) => console.error("Error creating reservation:", error));
    }
  };

  let displayErrors = reservationErrors.map((error, index) => (
    <ErrorAlert key={index} error={{ message: error }} />
  ));
  

  return (
    <div>
      {displayErrors}
      <NewReservationForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewReservation;
