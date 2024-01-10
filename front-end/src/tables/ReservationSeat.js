import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, listReservations, assignTableToReservation } from "../utils/api";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

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
      listReservations(abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    };

    loadTables();
    loadReservations();

    return () => abortController.abort();
  }, []);

  const reservation = reservations.find((r) => r.reservation_id === Number(reservation_id));

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await assignTableToReservation(selectedTable, reservation_id);
      history.push("/dashboard");
    } catch (error) {
      console.error("Error assigning table:", error);
      setErrorMessage(error.message);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const availableTables = tables.filter(
    (table) => table.capacity >= reservation?.people && table.reservation_id === null
  );

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
            {availableTables.map((table) => (
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