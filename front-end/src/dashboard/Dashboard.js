import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ListTables from "./ListTables";
import ErrorAlert from "../new reservation/ErrorAlert";
import ListReservation from "../new reservation/ListReservation";
import './Dashboard.css';
import { previous, today, next } from "../utils/date-time";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationDate, setReservationDate] = useState(date);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const loadReservationsAndTables = () => {
    const abortController = new AbortController();

    const loadReservations = () => {
      setReservationsError(null);
      listReservations({ date: reservationDate }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    };

    const loadTables = () => {
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
    };

    loadReservations();
    loadTables();

    return () => abortController.abort();
  };

  const handleDateChange = (newDate) => {
    setReservations([]);
    setReservationsError(null);
    setTables([]);
    setTablesError(null);
    setReservationDate(newDate);
  };

  useEffect(() => {
    loadReservationsAndTables();
  }, [reservationDate]);

  return (
    <main className="dashboard">
      <h1>Reservation Dashboard</h1>
      <div className="d-md-flex flex-column">
        {!reservations.length && <h2>No reservations on this date.</h2>}
      </div>
      <ErrorAlert error={reservationsError} />

      {/* Date navigation buttons */}
      <div className="date-navigation">
        <button
          type="button"
          onClick={() => handleDateChange(previous(reservationDate))}
          className="btn btn-secondary"
        >
          {`<  Yesterday`}
        </button>
        <span>{reservationDate}</span>
       
        <button
          type="button"
          onClick={() => handleDateChange(next(reservationDate))}
          className="btn btn-secondary"
        >
          {`Tomorrow  >`}
        </button>
      </div>

      {/* Reservations */}
      <div className="reservations-list">
        <h4 className="mb-2">Reservations for {reservationDate}</h4>
        <ListReservation
          reservations={reservations}
          setReservationsError={setReservationsError}
          loadReservationsAndTables={loadReservationsAndTables}
        />
      </div>

      {/* Tables */}
      <div className="tables-list">
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Tables</h4>
        </div>
        {!tables && <h5 className="load-message">Loading...</h5>}
        <ListTables 
          tables={tables}
          setTablesError={setTablesError}
          loadReservationsAndTables={loadReservationsAndTables}
        />
      </div>
    </main>
  );
}

export default Dashboard;
