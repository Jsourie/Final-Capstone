import React from "react";

function NewReservationForm({ formData ={}, handleInputChange, handleSubmit, goBack }) {
 
    const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
      } = formData;

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
          placeholder="e.g., 555-123-4567"
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

export default NewReservationForm