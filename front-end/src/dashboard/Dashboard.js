import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ListTables from "./ListTables";
import ErrorAlert from "../new reservation/ErrorAlert";
import ListReservation from "../new reservation/ListReservation";
import './Dashboard.css';


function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const loadReservationsAndTables = () => {
    const abortController = new AbortController();
    
    const loadReservations = () => {
      setReservationsError(null);
      listReservations({ date }, abortController.signal)
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

  useEffect(() => {
    loadReservationsAndTables();
  }, [date]);


    return (
      <main className="dashboard">
        <h1>Reservation Dashboard</h1>
        <div className="d-md-flex flex-column">
          {!reservations.length && <h2>No reservations on this date.</h2>}
        </div>
        <ErrorAlert error={reservationsError} setError={setReservationsError} />

        {/* Reservations */}
        <div className="reservations-list">
          <h4 className="mb-2">Reservations for {date}</h4>
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