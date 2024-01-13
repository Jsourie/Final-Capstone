import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param errors
 *  an array of error messages.
 * @returns {JSX.Element|null}
 *  a bootstrap danger alert that contains the error messages, or null if no errors.
 */

function ReservationAlert({ errors }) {
  return (
    errors && errors.length > 0 && (
      <div className="alert alert-danger m-2">
        {errors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    )
  ) || null;
}

export default ReservationAlert;
