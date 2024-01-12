import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { editReservation, readEditedReservation } from "../utils/api";
import NewReservationForm from "./NewReservationForm"; 
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";

function EditReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
  
    const loadReservationDetails = async () => {
      try {
        const reservationDetails = await readEditedReservation(
          reservation_id,
          abortController.signal
        );
        setFormData(reservationDetails); // Set form data to the fetched reservation details
      } catch (error) {
        console.error("Error fetching reservation details:", error);
        setError(error);
      }
    };
  
    loadReservationDetails();
  
    return () => abortController.abort();
  }, [reservation_id]);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formattedFormData = {
      ...formatReservationDate(formData),
      ...formatReservationTime(formData),
    };
  
    editReservation(reservation_id, formattedFormData)
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
  }
  

  const goBack = () => {
    history.goBack();
  };

  return (
    <NewReservationForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      goBack={goBack}
    />
  );
}

export default EditReservation;