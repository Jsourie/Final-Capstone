import React from "react";

function ReservationErrors({ errors }) {
    return (
      <div className="alert alert-danger">
        {errors && errors.map((error, index) => (
          <p key={index}>{error.message}</p>
        ))}
      </div>
    );
  }
  
  export default ReservationErrors;
  