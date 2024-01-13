import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, readReservation } from "../utils/api";
import NewReservationForm from "./NewReservationForm";
import ReservationAlert from "./ReservatioAlert";


function NewReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservation, setReservation] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reservation_id) {
      setError(null);
      readReservation(reservation_id)
        .then(setReservation)
        .catch(setError);
    }
  }, [reservation_id]);

  const handleInputChange = ({ target }) => {
    let { value, name } = target;
    if (name === "people") {
      setReservation({
        ...reservation,
        [name]: Number(value),
      });
    } else {
      setReservation({
        ...reservation,
        [name]: value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    createReservation(reservation)
      .then((response) => {
        // Check if the response indicates success
        if (response.status === "success") {
          history.push(`/dashboard/?date=${reservation.reservation_date}`);
        } else {
          // If the response indicates an error, set the error state
          setError({
            messages: response.errors || ["Failed to create reservation"],
          });
        }
      })
      .catch((error) => {
        // Handle network or unexpected errors
        setError({
          messages: ["An unexpected error occurred while creating the reservation"],
        });
        console.error("Error in createReservation:", error); // Log the error to the console
      });
  };
  
  
  
  return (
    <div>
<ReservationAlert error={error} />     
 <NewReservationForm
        formData={reservation}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewReservation;
