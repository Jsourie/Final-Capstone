import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";

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


  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = formData;

  useEffect(() => {
    const abortController = new AbortController();

    const loadReservationDetails = async () => {
      try {
        const reservationDetails = await readReservation(reservation_id, abortController.signal);
        setFormData({
          first_name: reservationDetails.first_name,
          last_name: reservationDetails.last_name,
          mobile_number: reservationDetails.mobile_number,
          reservation_date: reservationDetails.reservation_date,
          reservation_time: reservationDetails.reservation_time,
          people: reservationDetails.people,
        });
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
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
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
        const combinedErrorMessage = errorMessages.join(" ");
        console.log("Error messages:", combinedErrorMessage);
  
        setError(new Error(combinedErrorMessage));
        return;
      }
  
      updateReservation(formData)
        .then(() => {
          setFormData({ ...initialFormState });
          const reservationDate = formData.reservation_date;
          const queryParams = new URLSearchParams({ date: reservationDate });
          history.push(`/dashboard?${queryParams}`);
        })
        .catch((error) => {
          console.error("Error creating reservation:", error);
          setError(error);
        });
    };
  
    const goBack = () => {
      history.goBack();
    };
  

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                onChange={handleInputChange}
                value={first_name}
                className="form-control"
                placeholder={first_name}
                required
              />
            </div>
            <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
           <input
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleInputChange}
            value={last_name}
            className="form-control"
            placeholder={last_name}
            required
          />
            </div>
             
            <div className="form-group">
            <label htmlFor="mobile_number">Phone Number</label>
           <input
          type="tel"  
          name="mobile_number"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
          value={mobile_number}
          onChange={handleInputChange}
          placeholder={mobile_number}
          required
        />
         </div>
         <div className="form-group">
  <label htmlFor="reservation_date">Date of reservation</label>
  <input
    type="date"
    id="reservation_date"
    name="reservation_date"
    value={reservation_date}
    onChange={handleInputChange}
    className="form-control"
    placeholder={reservation_date}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="reservation_time">Time of reservation</label>
  <input
    type="time"
    id="reservation_time"
    name="reservation_time"
    value={reservation_time}
    onChange={handleInputChange}
    className="form-control"
    placeholder={reservation_date.reservation_time}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="people">Number of People</label>
  <input
    type="number"
    id="people"
    name="people"
    value={people}
    onChange={handleInputChange}
    className="form-control"
    min="1"
    placeholder={people}
    required
  />
</div>
    <button onClick={goBack} className="btn btn-danger mr-2">
              Cancel
     </button>
        <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditReservation;