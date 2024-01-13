import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import NewReservationForm from "./NewReservationForm";
import ReservationErrors from "./ReservationErrors";

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
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "people" ? Number(value) : value,
    }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const today = new Date();
    const selectedDateTime = new Date(`${formData.reservation_date}  ${formData.reservation_time}`);
    const openingTime = new Date(`${formData.reservation_date} 10:30:00`);
    const closingTime = new Date(`${formData.reservation_date} 22:30:00`);
    const errorMessages = [];

    if (selectedDateTime.getDay() === 2) {
     errorMessages.push("The restaurant is closed on Tuesdays.");
     }

    if (selectedDateTime > closingTime) {
      errorMessages.push("Reservation time must be before 10:30 PM.");
      console.log(closingTime)
      console.log(selectedDateTime)
    }

    if (selectedDateTime < today) {
      errorMessages.push("Reservation date must be in the future.");
    }

    if (selectedDateTime < openingTime) {
      errorMessages.push("Reservation time must be after 10:30 AM.");
     }

    if (errorMessages.length > 0) {
      const combinedErrorMessage = errorMessages.join(" ");
      console.log("Error messages:", combinedErrorMessage);

      setError(new Error(combinedErrorMessage));
      return;
    }

    createReservation(formData)
    .then(() => {
      setFormData({ ...initialFormState });
      const reservationDate = formData.reservation_date;
      const dashboardRoute = `/dashboard?date=${reservationDate}`;
      history.push(dashboardRoute);
    })
    .catch((error) => {
      console.error("Error creating reservation:", error);
      setError(error); 
    });
};

 

  return (
    <div>
      <ReservationErrors errors={error ? [error] : null} />
       <NewReservationForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        
      />
    </div>
  );
}

export default NewReservation;