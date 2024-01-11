import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation, seatReservation } from "../utils/api";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadTables = () => {
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
    };

    const loadReservations = () => {
      setReservationsError(null);
      readReservation(reservation_id, abortController.signal)
        .then((reservation) => setReservations([reservation]))
        .catch(setReservationsError);
    };

    loadTables();
    loadReservations();

    return () => abortController.abort();
  }, [reservation_id]);

  const reservation = reservations[0];

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const validate = (table_id) => {
    const errors = [];
    const selectedTable = tables.find((table) => table.table_id === Number(table_id));
    if (selectedTable.reservation_id) {
      errors.push(new Error(`Table ${table_id} is occupied`));
    }

    if (reservation.people > selectedTable.capacity) {
      errors.push(
        new Error(`Table capacity not big enough to fit a party of ${reservation.people}`)
      );
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the selected table
    const validationErrors = validate(selectedTable);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.map((error) => error.message).join(" "));
      return;
    }

    try {
      await seatReservation(selectedTable, reservation_id);
      history.push("/dashboard");
    } catch (error) {
      console.error("Error assigning table:", error);
      setErrorMessage(error.message);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div>
      <h2>Seat Reservation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="table_id">Table Number:</label>
          <select
            id="table_id"
            name="table_id"
            value={selectedTable}
            onChange={handleTableChange}
            required
          >
            <option value="" disabled>
              Select a table
            </option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-danger">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationSeat;
