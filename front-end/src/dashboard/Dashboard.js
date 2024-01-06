import React, { useEffect, useState } from "react";
import { deleteSeat, listReservations, listTables, updateReservation } from "../utils/api";
import { Link, useParams, useHistory} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function Dashboard({ date }) {
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

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

    const loadTables = () => {
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
    };

    loadTables();

    return () => abortController.abort();
  }, []); 



  const handleFinish = async (tableId, reservation) => {
    const confirmed = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    
    if (confirmed) {
      try {
        await deleteSeat(tableId);
        await updateReservation(reservation.reservation_id, 'finished');
        history.push("/");
      } catch (error) {
        console.error("Error finishing table:", error);
      }
    }
  };
  


  const handleSeated = async (reservationId) => {   
      try {
        await updateReservation(reservationId, 'seated');
        history.push("/");
      } catch (error) {
        console.error("Error updating reservation status:", error);
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
  onClick={() => handleSeated(reservation.reservation_id, reservation)} 
>
  Seat
</button>

        </Link>
      )}
      <Link to={`/reservations/${reservation.reservation_id}/edit`}>
        <button className="btn btn-secondary">Edit</button>
      </Link>
      <h5 className="card-title">{reservation.last_name}, {reservation.first_name}</h5>
      <p className="card-text">Date: {reservation.reservation_date}</p>
      <p className="card-text">Time: {reservation.reservation_time}</p>
      <p className="card-text">Status: {reservation.status}</p>
    </div>
  ))}
</div>
      <div className="card-container">
  {tables.map((table) => (
    <div key={table.table_id} className="card">
      <h5 className="card-title">{table.table_name}, {table.capacity}</h5>
      <p data-table-id-status={table.table_id}>
        {table.reservation_id ? "Occupied" : "Free"} 
      </p>
      {table.reservation_id && (
        <button
          className="btn btn-primary"
          data-table-id-finish={table.table_id}
          onClick={() => handleFinish(table.table_id)}
        >
          Finish
        </button>
      )}
    </div>
  ))}
</div>
</main>
  );
}

export default Dashboard;
