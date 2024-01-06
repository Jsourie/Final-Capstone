import React from "react";

function ReservationErrors({ errors }) {
  if (errors !== null && errors.length > 0) {
    console.log("Errors:", errors);
    return (
      <div className="alert alert-danger">
        <p>ERROR:</p>
        {errors.map((error, index) => (
          <p key={index}>{error.message}</p>
        ))}
      </div>
    );
  }
  return null;
}

export default ReservationErrors;
