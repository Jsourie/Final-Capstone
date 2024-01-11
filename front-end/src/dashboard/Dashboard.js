import React, { useEffect, useState } from "react";
import { deleteSeat, listReservations, listTables } from "../utils/api";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ListTables from "./ListTables";

function Dashboard({ date }) {
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // Function to load tables
  const loadTables = async () => {
    setTablesError(null);
    try {
      const data = await listTables();
      setTables(data);
    } catch (error) {
      setTablesError(error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadDashboard = () => {
      setReservationsError(null);
      console.log("Fetching reservations for date:", date);
      listReservations({ date }, abortController.signal)
        .then((data) => {
          console.log("Reservations fetched successfully:", data);
          setReservations(data);
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
          setReservationsError(error);
        });
    };

    loadDashboard();

    return () => abortController.abort();
  }, [date]);

  useEffect(() => {
    const abortController = new AbortController();

    // Initial load of tables
    loadTables();

    return () => abortController.abort();
  }, []);

  const handleFinish = async (tableId, reservationId) => {
    try {
      await deleteSeat(tableId, reservationId);
      // Reload tables after finishing a table
      await loadTables();
      history.push("/");
    } catch (error) {
      console.error("Error finishing table:", error);
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="card-container">
        {reservations.map((reservation) => (
          <div key={reservation.reservation_id} className="card">
            {reservation.status === "booked" && (
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                <button
                  className="btn btn-primary"
                  data-reservation-id-status={reservation.reservation_id}
                >
                  Seat
                </button>
              </Link>
            )}
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-secondary">Edit</button>
            </Link>
            <h5 className="card-title">
              {reservation.last_name}, {reservation.first_name}
            </h5>
            <p className="card-text">Date: {reservation.reservation_date}</p>
            <p className="card-text">Time: {reservation.reservation_time}</p>
            <p className="card-text">Status: {reservation.status}</p>
          </div>
        ))}
      </div>
      <div className="card-container">
        <ListTables onFinish={handleFinish} tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;
